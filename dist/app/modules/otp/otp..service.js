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
exports.OTPService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const user_model_1 = require("../user/user.model");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const redis_config_1 = require("../../config/redis.config");
const sendEmail_1 = require("../../utils/sendEmail");
const env_1 = require("../../config/env");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const OTP_EXPIRATION = 2 * 60; // 2minute
const generateOtp = (length = 6) => {
    //6 digit otp
    const otp = crypto_1.default.randomInt(10 ** (length - 1), 10 ** length).toString();
    // 10 ** 5 => 10 * 10 *10 *10 *10 * 10 => 1000000
    return otp;
};
const sendOTP = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.default(404, "User not found");
    }
    if (user.isDeleted) {
        throw new AppError_1.default(401, "You are already deleted");
    }
    const otp = generateOtp();
    const redisKey = `otp:${email}`;
    yield redis_config_1.redisClient.set(redisKey, otp, {
        expiration: {
            type: "EX",
            value: OTP_EXPIRATION
        }
    });
    yield (0, sendEmail_1.sendEmail)({
        to: email,
        subject: "Your OTP Code",
        templateName: "otp",
        templateData: {
            role: "User",
            otp: otp
        }
    });
});
// const verifyOTP = async (email: string, otp: string) => {
//     // const user = await User.findOne({ email, isVerified: false })
//     const user = await User.findOne({ email })
//     if (!user) {
//         throw new AppError(404, "User not found")
//     }
//     if (user.isDeleted) {
//         throw new AppError(401, "You are already verified")
//     }
//     const redisKey = `otp:${email}`
//     const savedOtp = await redisClient.get(redisKey)
//     if (!savedOtp) {
//         throw new AppError(401, "Invalid OTP");
//     }
//     if (savedOtp !== otp) {
//         throw new AppError(401, "Invalid OTP");
//     }
//     await Promise.all([
//         User.updateOne({ email }, { isVerified: true }, { runValidators: true }),
//         redisClient.del([redisKey])
//     ])
// };
const verifyOTPAndResetPassword = (email, otp, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    // Step 1: User খুঁজে বের করা
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.default(404, "User not found");
    }
    if (user.isDeleted) {
        throw new AppError_1.default(401, "You are already deleted");
    }
    // Step 2: Redis থেকে OTP চেক করা
    const redisKey = `otp:${email}`;
    const savedOtp = yield redis_config_1.redisClient.get(redisKey);
    if (!savedOtp || savedOtp !== otp) {
        throw new AppError_1.default(401, "Invalid OTP");
    }
    // Step 3: Password Hash করা
    const hashedPassword = yield bcryptjs_1.default.hash(newPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    // Step 4: User password update করা
    user.password = hashedPassword;
    yield user.save();
    // Step 5: Redis থেকে OTP মুছে ফেলা
    yield redis_config_1.redisClient.del(redisKey);
    return {
        success: true,
        message: "Password reset successfully",
    };
});
exports.OTPService = {
    sendOTP,
    verifyOTPAndResetPassword
};
