import AppError from "../../errorHelpers/AppError";
import { TUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { generateToken } from "../../utils/jwt";
import { envVars } from "../../config/env";

const userLogin = async (payload: Partial<TUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    throw new AppError(httpStatus.CONFLICT, "User does not exists");
  }

  const isPasswordMatch = await bcrypt.compare(
    password as string,
    isUserExist.password as string
  );

  if (!isPasswordMatch) {
    throw new AppError(httpStatus.CONFLICT, "incorrect password");
  }

  const jwtPayload = {
    id:isUserExist._id,
    email:isUserExist.email,
    role:isUserExist.role
  }

  const accessToken= generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_EXPIRES_IN)


  return {
    accessToken,
  };
};


export const authService = {
  userLogin,
};
