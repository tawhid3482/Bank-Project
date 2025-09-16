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
exports.OTPService = exports.initOtpExpireListener = void 0;
const crypto_1 = __importDefault(require("crypto"));
const user_model_1 = require("../user/user.model");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const redis_config_1 = require("../../config/redis.config");
const sendEmail_1 = require("../../utils/sendEmail");
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
// const verifyOTP = async (
//   email: string,
//   otp: string,
//   // newPassword: string
// ) => {
//   // Step 1: User খুঁজে বের করা
//   const user = await User.findOne({ email });
//   if (!user) {
//     throw new AppError(404, "User not found");
//   }
//   if (user.isDeleted) {
//     throw new AppError(401, "You are already deleted");
//   }
//   // Step 2: Redis থেকে OTP চেক করা
//   const redisKey = `otp:${email}`;
//   const savedOtp = await redisClient.get(redisKey);
//   if (!savedOtp || savedOtp !== otp) {
//     throw new AppError(401, "Invalid OTP");
//   }
//   // // Step 4: User isOTPVerified update করা
//   user.isOTPVerified = true
//   await user.save();
//   // Step 5: Redis থেকে OTP মুছে ফেলা
//   await redisClient.del(redisKey);
//   return {
//     success: true,
//     message: "OTP verified successfully",
//   };
// };
const verifyOTP = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user)
        throw new AppError_1.default(404, "User not found");
    if (user.isDeleted)
        throw new AppError_1.default(401, "You are already deleted");
    // OTP চেক
    const redisKey = `otp:${email}`;
    const savedOtp = yield redis_config_1.redisClient.get(redisKey);
    if (!savedOtp || savedOtp !== otp) {
        throw new AppError_1.default(401, "Invalid OTP");
    }
    // verified
    user.isOTPVerified = true;
    yield user.save();
    yield redis_config_1.redisClient.del(redisKey);
    // expire flag set করা (2 min)
    const expireKey = `otpVerifiedExpire:${email}`;
    yield redis_config_1.redisClient.set(expireKey, "true", { EX: 120 });
    return {
        success: true,
        message: "OTP verified successfully, valid for 2 minutes",
    };
});
// 🔹 Redis expire event listener (একবারই app boot এ call করবে)
const initOtpExpireListener = () => __awaiter(void 0, void 0, void 0, function* () {
    yield redis_config_1.redisSubscriber.connect();
    yield redis_config_1.redisSubscriber.configSet("notify-keyspace-events", "Ex");
    yield redis_config_1.redisSubscriber.subscribe("__keyevent@0__:expired", (key) => __awaiter(void 0, void 0, void 0, function* () {
        if (key.startsWith("otpVerifiedExpire:")) {
            const email = key.split(":")[1];
            const freshUser = yield user_model_1.User.findOne({ email });
            if (freshUser) {
                freshUser.isOTPVerified = false;
                yield freshUser.save();
            }
        }
    }));
});
exports.initOtpExpireListener = initOtpExpireListener;
exports.OTPService = {
    sendOTP,
    verifyOTP,
    initOtpExpireListener: exports.initOtpExpireListener
};
