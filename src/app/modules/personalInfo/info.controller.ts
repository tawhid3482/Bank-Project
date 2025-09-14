import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { personalInfoServices } from "./info.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

const createPersonalInfo = catchAsync(async (req: Request, res: Response) => {
  const result = await personalInfoServices.createPersonalInfoIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Personal info created successfully",
    data: result,
  });
});

const getPersonalInfo = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await personalInfoServices.getPersonalInfoFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Personal info retrieved successfully",
    data: result,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user;
  const result = await personalInfoServices.getMe(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Personal info retrieved successfully",
    data: result,
  });
});

const getAdminStats = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user;
  const result = await personalInfoServices.getAdminStatsFromDB(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Stats retrieved successfully",
    data: result,
  });
});

const getAllPersonalInfo = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await personalInfoServices.getAllPersonalInfoFromDB(
    query as Record<string, string>
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Personal info retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const requestLoad = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.user)
  const { id } = req.user;
  const result = await personalInfoServices.requestLoanSetInfoDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Loan amount set successfully",
    data: result,
  });
});

const updatePersonalInfo = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user;
  const result = await personalInfoServices.updatePersonalInfoInfoDB(
    id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Personal info updated successfully",
    data: result,
  });
});

const approvedLoan = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await personalInfoServices.approvedLoan(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Loan Approved Successfully",
    data: result,
  });
});

const rejectedLoan = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await personalInfoServices.rejectYourLoan(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Sorry Your Loan Request is not Approved!",
    data: result,
  });
});

export const PersonalInfoController = {
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
