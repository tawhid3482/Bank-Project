import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { personalInfRoutes } from "../modules/personalInfo/info.route";
import { authRoute } from "../modules/auth/auth.route";

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
];

modules.forEach((route) => {
  router.use(route.path, route.route);
});
