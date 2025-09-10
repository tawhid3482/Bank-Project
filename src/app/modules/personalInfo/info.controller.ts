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


export const PersonalInfoController = {
    createPersonalInfo
}