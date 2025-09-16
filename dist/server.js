"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./app/config/env");
const seedSuperAdmin_1 = require("./app/utils/seedSuperAdmin");
const redis_config_1 = require("./app/config/redis.config");
const otp__service_1 = require("./app/modules/otp/otp..service");
let server;
const bankStart = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(env_1.envVars.DATABASE_URL);
        server = app_1.default.listen(env_1.envVars.PORT, () => {
            console.log(`Bank server running on port ${env_1.envVars.PORT}`);
        });
    }
    catch (err) {
        console.log(err);
    }
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, redis_config_1.connectRedis)();
    yield (0, otp__service_1.initOtpExpireListener)();
    yield bankStart();
    yield (0, seedSuperAdmin_1.seedSuperAdmin)();
}))();
process.on("SIGTERM", () => {
    console.log("SIGTERM received! Server is Shutting down...");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
});
process.on("SIGINT", () => {
    console.log("SIGINT received! Server is Shutting down...");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
});
process.on("unhandledRejection", () => {
    console.log("unhandledRejection received! Server is Shutting down...");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
});
process.on("uncaughtException", () => {
    console.log("uncaughtException received! Server is Shutting down...");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
});
