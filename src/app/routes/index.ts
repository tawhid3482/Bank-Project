import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";

export const router = Router();

const modules = [
  {
    path: "/user",
    route: UserRoutes,
  },
];

modules.forEach((route) => {
  router.use(route.path, route.route);
});
