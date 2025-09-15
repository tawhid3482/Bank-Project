"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("./user.interface");
const userValidationSchema = zod_1.default
    .object({
    phone: zod_1.default.string(),
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(4),
})
    .strict();
const updateUserValidationSchema = zod_1.default
    .object({
    phone: zod_1.default.string().optional(),
    password: zod_1.default.string().min(4).optional(),
    role: zod_1.default.enum(Object.values(user_interface_1.Role)).optional(),
})
    .strict();
exports.userValidation = {
    userValidationSchema,
    updateUserValidationSchema,
};
