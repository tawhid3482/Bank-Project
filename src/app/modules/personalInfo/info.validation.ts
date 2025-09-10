import { z } from "zod";

// Enum same as your Gender type
export const GenderEnum = z.enum(["male", "female", "other"]);

// Contact Validation
const contactValidationSchema = z.object({
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip code is required"),
});

// Financial Info Validation
const financialInfoValidationSchema = z.object({
  income: z.number().nonnegative("Income must be positive"),
  landOwned: z.number().nonnegative("Land owned must be positive"),
  electricityBill: z.number().nonnegative("Electricity bill must be positive"),
  mobileBill: z.number().nonnegative("Mobile bill must be positive"),
  existingLoan: z.number().nonnegative("Loan must be positive"),
});

// Personal Info Validation
export const personalInfoValidationSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid userId (must be MongoDB ObjectId)"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  gender: GenderEnum,
  contact: contactValidationSchema,
  financialInfo: financialInfoValidationSchema,
}).strict();
