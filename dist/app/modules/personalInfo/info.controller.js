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
exports.PersonalInfoController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const info_service_1 = require("./info.service");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createPersonalInfo = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield info_service_1.personalInfoServices.createPersonalInfoIntoDB(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Personal info created successfully",
        data: result,
    });
}));
const getPersonalInfo = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield info_service_1.personalInfoServices.getPersonalInfoFromDB(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Personal info retrieved successfully",
        data: result,
    });
}));
const getMe = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const result = yield info_service_1.personalInfoServices.getMe(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Personal info retrieved successfully",
        data: result,
    });
}));
const getAdminStats = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const result = yield info_service_1.personalInfoServices.getAdminStatsFromDB(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Stats retrieved successfully",
        data: result,
    });
}));
const getAllPersonalInfo = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield info_service_1.personalInfoServices.getAllPersonalInfoFromDB(query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Personal info retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const requestLoad = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.user)
    const { id } = req.user;
    const result = yield info_service_1.personalInfoServices.requestLoanSetInfoDB(id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Loan amount set successfully",
        data: result,
    });
}));
const updatePersonalInfo = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const result = yield info_service_1.personalInfoServices.updatePersonalInfoInfoDB(id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Personal info updated successfully",
        data: result,
    });
}));
const approvedLoan = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield info_service_1.personalInfoServices.approvedLoan(id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Loan Approved Successfully",
        data: result,
    });
}));
const rejectedLoan = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield info_service_1.personalInfoServices.rejectYourLoan(id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Sorry Your Loan Request is not Approved!",
        data: result,
    });
}));
exports.PersonalInfoController = {
    createPersonalInfo,
    getAllPersonalInfo,
    requestLoad,
    updatePersonalInfo,
    approvedLoan,
    rejectedLoan,
    getPersonalInfo,
    getMe,
    getAdminStats
};
