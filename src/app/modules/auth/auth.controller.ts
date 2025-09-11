import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { setAuthCookie } from "../../utils/setCookie";

const userLogin = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.userLogin(req.body);

  setAuthCookie(res, result);

  // res.cookie("refreshToken", result.refreshToken, {
  //   httpOnly: true,
  //   secure: false,
  // });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    data: result,
  });
});

const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new AppError(httpStatus.BAD_REQUEST, "Login again");
  }

  const tokenInfo = await authService.getNewAccessToken(refreshToken as string);

  setAuthCookie(res, tokenInfo);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New Access token got successfully",
    data: tokenInfo,
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logout  successfully",
    data: null,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  const decodedToken = req.user
   await authService.resetPassword(
    oldPassword,
    newPassword,
    decodedToken
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Your password is successfully",
    data: null,
  });
});

export const authController = {
  userLogin,
  getNewAccessToken,
  logout,
  resetPassword,
};
