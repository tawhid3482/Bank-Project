import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { TPersonalInfo } from "./info.interface";
import httpStatus from "http-status-codes";
import { personalInfo } from "./info.model";

const createPersonalInfoIntoDB = async (payload: TPersonalInfo) => {
  const isUserExist = await User.findById(payload.userId);
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const result = await personalInfo.create(payload);
  return result;
};


export const personalInfoServices={
    createPersonalInfoIntoDB
}