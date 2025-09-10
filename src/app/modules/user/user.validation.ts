import z from "zod";
import { Role } from "./user.interface";

const userValidationSchema = z
  .object({
    phone: z.string(),
    email: z.string().email(),
    password: z.string().min(4),
  })
  .strict();
const updateUserValidationSchema = z
  .object({
    phone: z.string().optional(),
    password: z.string().min(4).optional(),
    role: z.enum(Object.values(Role) as [string]).optional(),
  })
  .strict();

export const userValidation = {
  userValidationSchema,
  updateUserValidationSchema,
};
