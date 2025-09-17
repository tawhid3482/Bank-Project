import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { personalInfo } from "./info.model";
import { TApproved, TPersonalInfo } from "./info.interface";
import { searchableFields, searchableFieldsNum } from "./info.constant";
import { QueryBuilder } from "../../utils/queryBuilder";
import { Role } from "../user/user.interface";

const calculateCreditScore = (
  income: number,
  landOwned: number,
  electricityBill: number,
  mobileBill: number,
  existingLoan: number
) => {
  const monthlyIncome = (income + landOwned) / 12;
  const totalDebt = electricityBill + mobileBill + existingLoan;
  const remaining = monthlyIncome - totalDebt;

  const debtToIncomeRatio =
    monthlyIncome > 0
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

  let score = (remaining / 100000) * 100;
  if (score > 100) score = 100;

  let category = "Very Poor";
  if (remaining >= 100000) category = "Excellent";
  else if (remaining >= 50000) category = "Good";
  else if (remaining >= 30000) category = "Fair";
  else if (remaining >= 10000) category = "Poor";

  return {
    score: Number(score.toFixed(2)),
    remaining,
    category,
    debtToIncomeRatio,
    monthlyIncome,
    totalDebt,
  };
};

export const createPersonalInfoIntoDB = async (payload: TPersonalInfo) => {
  const isUserExist = await User.findById(payload.userId);

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  const isInfoExist = await personalInfo.findOne({ userId: payload.userId });
  if (isInfoExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Info Already exists");
  }

  const { income, landOwned, electricityBill, mobileBill, existingLoan } =
    payload.financialInfo;

  const { score, debtToIncomeRatio, monthlyIncome, totalDebt } =
    calculateCreditScore(
      income,
      landOwned,
      electricityBill,
      mobileBill,
      existingLoan ?? 0
    );

  payload.creditScore = String(score);
  payload.debtToIncomeRatio = debtToIncomeRatio;
  payload.totalDebt = totalDebt;
  payload.monthlyIncome = Number(monthlyIncome.toFixed(2));

  const annualIncome = income + landOwned;
  // const annualElectricityBill = electricityBill * 12;
  // const annualMobileBill = mobileBill * 12;

  // const annualIncomeRange =
  //   annualIncome - (electricityBill + mobileBill + (existingLoan ?? 0));

  payload.annualInfo = {
    annualIncome: Number((annualIncome).toFixed(2)),
    annualElectricityBill: Number(
      (electricityBill).toFixed(2)
    ),
    annualMobileBill: Number(
      (mobileBill).toFixed(2)
    ),
  };

  const result = await personalInfo.create(payload);
  return result;
};

const getPersonalInfoFromDB = async (userId: string) => {
  // User theke phone, email niye ashi
  const user = await User.findById(userId).select("phone email");
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "Please login first");
  }

  // PersonalInfo theke firstName, lastName, contact niye ashi
  const info = await personalInfo
    .findOne({ userId })
    .select("firstName lastName contact");

  if (!info) {
    throw new AppError(httpStatus.NOT_FOUND, "Personal info not found");
  }

  // Merge kore result return kori
  return {
    firstName: info.firstName,
    lastName: info.lastName,
    contact: info.contact,
    phone: user.phone,
    email: user.email,
  };
};

const getMe = async (userId: string) => {
  const user = await User.findById(userId).select("phone email");

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "Please login first");
  }

  const info = await personalInfo
    .findOne({ userId })

  if (!info) {
    throw new AppError(httpStatus.NOT_FOUND, "Personal info not found");
  }

  return {
    info,
    phone: user.phone,
    email: user.email,
  };
};

const getAdminStatsFromDB = async (userId: string) => {
  const user = await User.findById(userId);
  if (user?.role !== Role.ADMIN && user?.role !== Role.SUPER_ADMIN) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are not valid User");
  }

  // সব data count (status যাই হোক না কেন)
  const totalCount = await personalInfo.find().countDocuments();

  // Approved count
  const approvedCount = await personalInfo.countDocuments({
    status: "approved",
  });

  // Pending count
  const pendingCount = await personalInfo.countDocuments({
    status: "pending",
  });
  // Reject count
  const rejectedCount = await personalInfo.countDocuments({
    status: "rejected",
  });

  if (totalCount === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "Personal info not found");
  }

  return {
    totalCount,
    approvedCount,
    pendingCount,
    rejectedCount,
  };
};

const getAllPersonalInfoFromDB = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(personalInfo.find(), query);

  const infos = await queryBuilder
    .filter()
    .search(searchableFields, searchableFieldsNum)
    .sort()
    .fields()
    .paginate()
    .build();

  const meta = await queryBuilder.getMeta();

  return {
    data: infos,
    meta,
  };
};
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

const requestLoanSetInfoDB = async (
  userId: string,
  payload: Partial<TPersonalInfo>
) => {
  const result = await personalInfo.findOneAndUpdate(
    { userId },
    { $set: { ...payload, status: "pending" } },
    { new: true }
  );
  return result;
};

const updatePersonalInfoInfoDB = async (
  userId: string,
  payload: Partial<TPersonalInfo> & { phone?: string }
) => {
  // প্রথমে PersonalInfo update
  await personalInfo.findOneAndUpdate(
    { userId },
    { $set: payload },
    { new: true }
  );

  // যদি phone আসে, তাহলে User এ update করব
  if (payload.phone) {
    await User.findOneAndUpdate(
      { _id: userId },
      { $set: { phone: payload.phone } },
      { new: true }
    );
  }

  return payload;
};


const approvedLoan = async (id: string, payload: Partial<TApproved>) => {
  
  const result = await personalInfo.findByIdAndUpdate(
     id ,
    {
      $set: {
        isApproved: payload,
        status: "approved",
      },
      $unset: { rejectedNotes: "" }, // rejection data মুছে ফেলবে
    },
    { new: true }
  );

  return result;
};

const rejectYourLoan = async (
  id: string,
  payload: { rejectedNotes: string }
) => {
  const result = await personalInfo.findByIdAndUpdate(
    id ,
    {
      $set: {
        rejectedNotes: payload.rejectedNotes,
        status: "rejected",
      },
      $unset: { isApproved: "" }, // approved data মুছে ফেলবে
    },
    { new: true }
  );

  return result;
};

export const personalInfoServices = {
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
