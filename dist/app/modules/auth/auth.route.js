"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoute = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const router = (0, express_1.Router)();
router.post("/login", auth_controller_1.authController.userLogin);
router.post("/refresh-token", auth_controller_1.authController.getNewAccessToken);
router.post("/logout", auth_controller_1.authController.logout);
router.post("/change-password", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), auth_controller_1.authController.changePassword);
// router.post("/forgot-password", authController.forgotPassword)
router.post("/reset-password", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), auth_controller_1.authController.resetPassword);
exports.authRoute = router;
