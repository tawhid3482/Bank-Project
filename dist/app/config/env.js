"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVars = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const loadEnvVariables = () => {
    const requiredVars = ["PORT", "NODE_ENV", "DATABASE_URL"];
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
    };
};
exports.envVars = loadEnvVariables();
