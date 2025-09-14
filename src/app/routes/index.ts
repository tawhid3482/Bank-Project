import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { personalInfRoutes } from "../modules/personalInfo/info.route";
import { authRoute } from "../modules/auth/auth.route";
import { OtpRoutes } from "../modules/otp/otp.route";

export const router = Router();

const modules = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/info",
    route: personalInfRoutes,
  },
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/otp",
    route: OtpRoutes,
  },
];

modules.forEach((route) => {
  router.use(route.path, route.route);
});
