import AppError from "../../errorHelpers/AppError";
import { Role, TUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createUserService = async (payload: TUser) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new AppError(httpStatus.CONFLICT, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const user = await User.create({ email, password: hashedPassword, ...rest });

  return user;
};

const getAllUsersFromDB = async () => {
  const user = await User.find({});

  const totalUsers = await User.countDocuments();

  return {
    data: user,
    meta: {
      total: totalUsers,
    },
  };
};

const updateUserInfoDB = async (
  userId: string,
  payload: Partial<TUser>,
  decodedToken: JwtPayload
) => {
  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }
  // if (
  //   isUserExist.isActive === "INACTIVE" ||
  //   isUserExist.isActive === "BLOCKED" ||
  //   isUserExist.isDeleted
  // ) {
  //   throw new AppError(httpStatus.FORBIDDEN, "YOu can not update your password!");
  // }

  if (payload.role) {
    if (decodedToken.role === Role.USER) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
    if (
      decodedToken.role === Role.SUPER_ADMIN &&
      decodedToken.role === Role.ADMIN
    ) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  if (payload.isActive || payload.isDeleted) {
    if (decodedToken.role === Role.USER) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  if (payload.password) {
    payload.password = await bcrypt.hash(
      payload.password,
      Number(envVars.BCRYPT_SALT_ROUND)
    );
  }

  const newUpdateUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdateUser;
};

export const userServices = {
  createUserService,
  getAllUsersFromDB,
  updateUserInfoDB
};
