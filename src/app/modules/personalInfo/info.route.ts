import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { approvedLoanValidationSchema, personalInfoValidationSchema, rejectLoanValidationSchema, requestLoanValidationSchema, updatePersonalInfoValidationSchema } from "./info.validation";
import { PersonalInfoController } from "./info.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.post(
  "/create-info",
  validateRequest(personalInfoValidationSchema),
  PersonalInfoController.createPersonalInfo
);

router.get(
  "/me",
  checkAuth(...Object.values(Role)),
  PersonalInfoController.getMe
);


router.get(
  "/",
  checkAuth(Role.ADMIN,Role.SUPER_ADMIN),
  PersonalInfoController.getAllPersonalInfo
);

router.get("/stats", checkAuth(Role.ADMIN,Role.SUPER_ADMIN), PersonalInfoController.getAdminStats)


router.patch(
  "/request-loan",
  checkAuth(Role.USER),
  validateRequest(requestLoanValidationSchema),
  PersonalInfoController.requestLoad
);

router.patch(
  "/update-info",
  checkAuth(...Object.values(Role)),
  validateRequest(updatePersonalInfoValidationSchema),
  PersonalInfoController.updatePersonalInfo
);

router.get(
  "/:id",
  checkAuth(Role.ADMIN,Role.SUPER_ADMIN),
  PersonalInfoController.getPersonalInfo
);

router.patch(
  "/approved/:id",
  checkAuth(Role.ADMIN,Role.SUPER_ADMIN),
  validateRequest(approvedLoanValidationSchema),
  PersonalInfoController.approvedLoan
);
router.patch(
  "/rejected/:id",
  checkAuth(Role.ADMIN,Role.SUPER_ADMIN),
  validateRequest(rejectLoanValidationSchema),
  PersonalInfoController.rejectedLoan
);

export const personalInfRoutes = router;
