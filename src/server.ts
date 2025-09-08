/* eslint-disable no-console */
import { Server } from "http";
import app from "./app";
import mongoose from "mongoose";
import { envVars } from "./app/config/env";
let server: Server;

const bankStart = async () => {
  try {
    await mongoose.connect(envVars.DATABASE_URL);

    server = app.listen(envVars.PORT, () => {
      console.log(`Bank server running on port ${envVars.PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

bankStart();

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
