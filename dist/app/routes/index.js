"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const info_route_1 = require("../modules/personalInfo/info.route");
const auth_route_1 = require("../modules/auth/auth.route");
const otp_route_1 = require("../modules/otp/otp.route");
exports.router = (0, express_1.Router)();
const modules = [
    {
        path: "/user",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/info",
        route: info_route_1.personalInfRoutes,
    },
    {
        path: "/auth",
        route: auth_route_1.authRoute,
    },
    {
        path: "/otp",
        route: otp_route_1.OtpRoutes,
    },
];
modules.forEach((route) => {
    exports.router.use(route.path, route.route);
});
