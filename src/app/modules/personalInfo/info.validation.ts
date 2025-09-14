import { z } from "zod";

// Enum same as your Gender type
export const GenderEnum = z.enum(["male", "female", "other"]).optional();
export const Status = z.enum(["approved", "pending", "rejected"]).optional();

// Contact Validation
const contactValidationSchema = z.object({
  address: z.string().min(1, "Address is required").optional(),
  city: z.string().min(1, "City is required").optional(),
  state: z.string().min(1, "State is required").optional(),
  zipCode: z.string().min(1, "Zip code is required").optional(),
});

// Financial Info Validation
const financialInfoValidationSchema = z.object({
  income: z.number().nonnegative("Income must be positive"),
  landOwned: z.number().nonnegative("Land owned must be positive"),
  electricityBill: z.number().nonnegative("Electricity bill must be positive"),
  mobileBill: z.number().nonnegative("Mobile bill must be positive"),
  existingLoan: z.boolean(),
});

// Personal Info Validation
export const personalInfoValidationSchema = z
  .object({
    userId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid userId (must be MongoDB ObjectId)"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
    gender: GenderEnum,
    contact: contactValidationSchema,
    financialInfo: financialInfoValidationSchema,
  })
  .strict();

export const requestLoanValidationSchema = z
  .object({
    requestLoanAmount: z
      .number()
      .min(2)
      .nonnegative("request loan amount must be positive"),
  })
  .strict();

export const updatePersonalInfoValidationSchema = z
  .object({
    firstName: z.string().min(1, "First name is required").optional(),
    lastName: z.string().min(1, "Last name is required").optional(),
    dateOfBirth: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
      })
      .optional(),
    gender: GenderEnum.optional(),
    contact: contactValidationSchema.optional(),
  })
  .strict();

// Loan Info Validation
export const approvedLoanValidationSchema = z
  .object({
    loanAmount: z.number().nonnegative("loan amount must be positive"),
    interestRate: z.number().nonnegative("interest rate must be positive"),
    TermMonth: z.number().nonnegative("Term Month must be positive"),
    notes: z.string().optional(),
    status: z.string().optional(),
  })
  .strict();

export const rejectLoanValidationSchema = z
  .object({
    rejectedNotes:z.string(),
    status: z.string().optional(),
  })
  .strict();
