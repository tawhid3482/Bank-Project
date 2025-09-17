import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { userServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";


const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userServices.createUserService(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User created successfully",
    data: user,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const verifiedToken = req.user

  const payload = req.body;

  const user = await userServices.updateUserInfoDB(
    userId,
    payload,
    verifiedToken
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User updated successfully",
    data: user,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.getAllUsersFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user;
  const result = await userServices.getMe(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Personal info retrieved successfully",
    data: result,
  });
});

export const UserController = {
  createUser,
  getAllUsers,
  updateUser,
  getMe
};
