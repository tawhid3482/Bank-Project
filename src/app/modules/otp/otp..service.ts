import crypto from "crypto";
import { User } from "../user/user.model";
import AppError from "../../errorHelpers/AppError";
import { redisClient } from "../../config/redis.config";
import { sendEmail } from "../../utils/sendEmail";
const OTP_EXPIRATION = 2 * 60 // 2minute

const generateOtp = (length = 6) => {
    //6 digit otp
    const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString()

    // 10 ** 5 => 10 * 10 *10 *10 *10 * 10 => 1000000

    return otp
}

const sendOTP = async (email: string) => {

    const user = await User.findOne({ email })

    if (!user) {
        throw new AppError(404, "User not found")
    }

    if (user.isDeleted) {
        throw new AppError(401, "You are already deleted")
    }
    const otp = generateOtp();

    const redisKey = `otp:${email}`

    await redisClient.set(redisKey, otp, {
        expiration: {
            type: "EX",
            value: OTP_EXPIRATION
        }
    })

    await sendEmail({
        to: email,
        subject: "Your OTP Code",
        templateName: "otp",
        templateData: {
            role: "User",
            otp: otp
        }
    })
};

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


const verifyOTP = async (
  email: string,
  otp: string,
  // newPassword: string
) => {
  // Step 1: User খুঁজে বের করা
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (user.isDeleted) {
    throw new AppError(401, "You are already deleted");
  }

  // Step 2: Redis থেকে OTP চেক করা
  const redisKey = `otp:${email}`;
  const savedOtp = await redisClient.get(redisKey);

  if (!savedOtp || savedOtp !== otp) {
    throw new AppError(401, "Invalid OTP");
  }

  // // Step 4: User isOTPVerified update করা
  user.isOTPVerified = true
  await user.save();

  // Step 5: Redis থেকে OTP মুছে ফেলা
  await redisClient.del(redisKey);

  return {
    success: true,
    message: "OTP verified successfully",
  };
};
export const OTPService = {
    sendOTP,
    verifyOTP
}