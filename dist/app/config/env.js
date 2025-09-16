"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVars = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const loadEnvVariables = () => {
    const requiredVars = [
        "PORT",
        "NODE_ENV",
        "DATABASE_URL",
        "JWT_ACCESS_SECRET",
        "JWT_EXPIRES_IN",
        "BCRYPT_SALT_ROUND",
        "SUPER_ADMIN_EMAIL",
        "SUPER_ADMIN_PASS",
        "JWT_REFRESH_SECRET",
        "JWT_REFRESH_EXPIRED",
        "FRONTEND_URL",
        "SMTP_PORT",
        "SMTP_HOST",
        "SMTP_USER",
        "SMTP_FROM",
        "REDIS_HOST",
        "REDIS_PORT",
        "REDIS_USERNAME",
        "REDIS_PASSWORD",
    ];
    requiredVars.forEach((key) => {
        if (!process.env[key]) {
            {
                throw new Error(`Environment variable ${key}is not set`);
            }
        }
    });
    return {
        PORT: process.env.PORT,
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL: process.env.DATABASE_URL,
        JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
        JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
        BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND,
        SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,
        SUPER_ADMIN_PASS: process.env.SUPER_ADMIN_PASS,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
        JWT_REFRESH_EXPIRED: process.env.JWT_REFRESH_EXPIRED,
        FRONTEND_URL: process.env.FRONTEND_URL,
        EMAIL_SENDER: {
            SMTP_USER: process.env.SMTP_USER,
            SMTP_PASS: process.env.SMTP_PASS,
            SMTP_PORT: process.env.SMTP_PORT,
            SMTP_HOST: process.env.SMTP_HOST,
            SMTP_FROM: process.env.SMTP_FROM,
        },
        REDIS_HOST: process.env.REDIS_HOST,
        REDIS_PORT: process.env.REDIS_PORT,
        REDIS_USERNAME: process.env.REDIS_USERNAME,
        REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    };
};
exports.envVars = loadEnvVariables();
