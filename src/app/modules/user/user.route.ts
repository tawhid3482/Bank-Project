import { Router } from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { userValidation } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();

router.post(
  "/register",
  validateRequest(userValidation.userValidationSchema),
  UserController.createUser
);
router.patch(
  "/:id",
  checkAuth(...Object.values(Role)),
  validateRequest(userValidation.updateUserValidationSchema),
  UserController.updateUser
);

router.get("/all-users", UserController.getAllUsers);

export const UserRoutes = router;
