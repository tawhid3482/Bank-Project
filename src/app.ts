/* eslint-disable @typescript-eslint/no-unused-vars */
import { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import express from "express";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
import { envVars } from "./app/config/env";
const app: Application = express();

app.use(express.json());
app.use(cors({
  origin:envVars.FRONTEND_URL,
  credentials:true
}));
app.use(cookieParser())

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Bank start!");
});

app.use(globalErrorHandler);

app.use(notFound);

export default app;
