/* eslint-disable no-console */
import bcryptjs from "bcryptjs";
import { User } from "../modules/user/user.model";
import { envVars } from "../config/env";
import { Role, TUser } from "../modules/user/user.interface";

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await User.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
    });

    if (isSuperAdminExist) {
      console.log("Super Admin Already Exists!");
      return;
    }

    console.log("Trying to create Super Admin...");

    const hashedPassword = await bcryptjs.hash(
      envVars.SUPER_ADMIN_PASS,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const payload: TUser = {
      role: Role.SUPER_ADMIN,
      email: envVars.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      phone: "0126586455",
      isOTPVerified:false
    };

    const superadmin = await User.create(payload);
    console.log("Super Admin Created Successfully! ");
    console.log(superadmin);
  } catch (error) {
    console.log(error);
  }
};
