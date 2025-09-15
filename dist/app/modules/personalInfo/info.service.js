"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.personalInfoServices = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_model_1 = require("../user/user.model");
const info_model_1 = require("./info.model");
const info_constant_1 = require("./info.constant");
const queryBuilder_1 = require("../../utils/queryBuilder");
const user_interface_1 = require("../user/user.interface");
const calculateCreditScore = (income, // annual income
landOwned, // annual value / land worth
electricityBill, // monthly
mobileBill // monthly
) => {
    const monthlyIncome = (income + landOwned) / 12; // Annual → Monthly
    const totalDebt = electricityBill + mobileBill; // Monthly expense
    const remaining = monthlyIncome - totalDebt;
    // Debt-to-Income Ratio (%) with 2 decimal points
    const debtToIncomeRatio = monthlyIncome > 0
        ? ((totalDebt / monthlyIncome) * 100).toFixed(2) + "%"
        : "0%";
    if (remaining <= 0) {
        return {
            score: 0,
            remaining,
            category: "Very Poor",
            debtToIncomeRatio,
            monthlyIncome,
            totalDebt,
        };
    }
    // Score scaled out of 100 (cap at 100)
    let score = (remaining / 100000) * 100;
    if (score > 100)
        score = 100;
    // Category mapping
    let category = "Very Poor";
    if (remaining >= 100000)
        category = "Excellent";
    else if (remaining >= 50000)
        category = "Good";
    else if (remaining >= 30000)
        category = "Fair";
    else if (remaining >= 10000)
        category = "Poor";
    return {
        score: Number(score.toFixed(2)),
        remaining,
        category,
        debtToIncomeRatio,
        monthlyIncome,
        totalDebt,
    };
};
const createPersonalInfoIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findById(payload.userId);
    if (!isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    const { income, landOwned, electricityBill, mobileBill } = payload.financialInfo;
    // Generate Credit Score + Category + DTI
    const { score, debtToIncomeRatio, monthlyIncome, totalDebt } = calculateCreditScore(income, landOwned, electricityBill, mobileBill);
    // Save calculated fields into payload
    payload.creditScore = String(score); // schema তে String আছে
    payload.debtToIncomeRatio = debtToIncomeRatio; // percentage string
    payload.totalDebt = totalDebt;
    payload.monthlyIncome = monthlyIncome;
    // Calculate annual info percentages
    const annualIncome = income + landOwned;
    const annualElectricityBill = electricityBill * 12;
    const annualMobileBill = mobileBill * 12;
    const annualIncomeRange = annualIncome - (electricityBill + mobileBill);
    if (annualIncomeRange > 100000) {
        return 100;
    }
    payload.annualInfo = {
        annualIncome: Number((annualIncomeRange / 1000).toFixed(2)),
        annualElectricityBill: Number(((annualElectricityBill / annualIncome) * 100).toFixed(2)),
        annualMobileBill: Number(((annualMobileBill / annualIncome) * 100).toFixed(2)),
    };
    // Save in DB
    const result = yield info_model_1.personalInfo.create(payload);
    return result;
});
const getPersonalInfoFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // User theke phone, email niye ashi
    const user = yield user_model_1.User.findById(userId).select("phone email");
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Please login first");
    }
    // PersonalInfo theke firstName, lastName, contact niye ashi
    const info = yield info_model_1.personalInfo
        .findOne({ userId })
        .select("firstName lastName contact");
    if (!info) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Personal info not found");
    }
    // Merge kore result return kori
    return {
        firstName: info.firstName,
        lastName: info.lastName,
        contact: info.contact,
        phone: user.phone,
        email: user.email,
    };
});
const getMe = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId).select("phone email");
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Please login first");
    }
    const info = yield info_model_1.personalInfo
        .findOne({ userId })
        .select("firstName lastName contact");
    if (!info) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Personal info not found");
    }
    return {
        firstName: info.firstName,
        lastName: info.lastName,
        contact: info.contact,
        phone: user.phone,
        email: user.email,
    };
});
const getAdminStatsFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if ((user === null || user === void 0 ? void 0 : user.role) !== user_interface_1.Role.ADMIN && (user === null || user === void 0 ? void 0 : user.role) !== user_interface_1.Role.SUPER_ADMIN) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You are not valid User");
    }
    // সব data count (status যাই হোক না কেন)
    const totalCount = yield info_model_1.personalInfo.find().countDocuments();
    // Approved count
    const approvedCount = yield info_model_1.personalInfo.countDocuments({
        status: "approved",
    });
    // Pending count
    const pendingCount = yield info_model_1.personalInfo.countDocuments({
        status: "pending",
    });
    // Reject count
    const rejectedCount = yield info_model_1.personalInfo.countDocuments({
        status: "rejected",
    });
    if (totalCount === 0) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Personal info not found");
    }
    return {
        totalCount,
        approvedCount,
        pendingCount,
        rejectedCount,
    };
});
const getAllPersonalInfoFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new queryBuilder_1.QueryBuilder(info_model_1.personalInfo.find(), query);
    const infos = yield queryBuilder
        .filter()
        .search(info_constant_1.searchableFields, info_constant_1.searchableFieldsNum)
        .sort()
        .fields()
        .paginate()
        .build();
    const meta = yield queryBuilder.getMeta();
    return {
        data: infos,
        meta,
    };
});
// const getAllPersonalInfoFromDB = async (query: Record<string, string>) => {
//   const filter = query;
//   const searchTerm = query.searchTerm || "";
//   const sort = query.sort || "-createdAt";
//   const page = Number(query.page) || 1;
//   const limit = Number(query.limit) || 1;
//   const skip = (page - 1) * limit;
//   // field filtering
//   const fields = query.fields?.split(",").join(" ") || "";
//   for (const field of excludeField) {
//     delete filter[field];
//   }
//   // const searchQuery = {
//   //   $or: searchableFields.map((field) => ({
//   //     [field]: { $regex: searchTerm, $options: "i" },
//   //   })),
//   // };
//   const orConditions: any[] = [];
//   // string fields এর জন্য regex search
//   if (searchTerm) {
//     searchableFields.forEach((field) => {
//       orConditions.push({ [field]: { $regex: searchTerm, $options: "i" } });
//     });
//     // numeric fields এর জন্য exact match যদি searchTerm numeric হয়
//     if (!isNaN(Number(searchTerm))) {
//       const numericValue = Number(searchTerm);
//       searchableFieldsNum.forEach((field) => {
//         orConditions.push({ [field]: numericValue });
//       });
//     }
//   }
//   // query তৈরি
//   const searchQuery = orConditions.length > 0 ? { $or: orConditions } : {};
// const filterQuery  = personalInfo.find(filter)
// const info = filterQuery.find(searchQuery)
// const allInfo = await info.sort(sort)
//     .select(fields)
//     .skip(skip)
//     .limit(limit);
//   // const result = await personalInfo
//   //   .find(searchQuery)
//   //   .find(filter)
//   //   .sort(sort)
//   //   .select(fields)
//   //   .skip(skip)
//   //   .limit(limit);
//   const totalInfo = await personalInfo.countDocuments();
//   const totalPage = Math.ceil(totalInfo / limit);
//   const metadata = {
//     page: page,
//     limit: limit,
//     total: totalInfo,
//     totalPage: totalPage,
//   };
//   return {
//     data: allInfo,
//     meta: metadata,
//   };
// };
const requestLoanSetInfoDB = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield info_model_1.personalInfo.findOneAndUpdate({ userId }, { $set: Object.assign(Object.assign({}, payload), { status: "pending" }) }, { new: true });
    return result;
});
const updatePersonalInfoInfoDB = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield info_model_1.personalInfo.findOneAndUpdate({ userId }, { $set: payload }, { new: true });
    return payload;
});
const approvedLoan = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield info_model_1.personalInfo.findOneAndUpdate({ userId }, {
        $set: {
            isApproved: payload,
            status: "approved",
        },
        $unset: { rejectedNotes: "" }, // rejection data মুছে ফেলবে
    }, { new: true });
    return result;
});
const rejectYourLoan = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield info_model_1.personalInfo.findOneAndUpdate({ userId }, {
        $set: {
            rejectedNotes: payload.rejectedNotes,
            status: "rejected",
        },
        $unset: { isApproved: "" }, // approved data মুছে ফেলবে
    }, { new: true });
    return result;
});
exports.personalInfoServices = {
    createPersonalInfoIntoDB,
    getAllPersonalInfoFromDB,
    requestLoanSetInfoDB,
    updatePersonalInfoInfoDB,
    approvedLoan,
    rejectYourLoan,
    getPersonalInfoFromDB,
    getMe,
    getAdminStatsFromDB,
};
