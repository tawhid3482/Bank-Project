import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { personalInfoValidationSchema } from "./info.validation";
import { PersonalInfoController } from "./info.controller";

const router = Router();

router.post(
  "/create-info",
  validateRequest(personalInfoValidationSchema),
  PersonalInfoController.createPersonalInfo
);

export const personalInfRoutes = router;
