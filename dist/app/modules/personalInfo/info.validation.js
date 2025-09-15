"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectLoanValidationSchema = exports.approvedLoanValidationSchema = exports.updatePersonalInfoValidationSchema = exports.requestLoanValidationSchema = exports.personalInfoValidationSchema = exports.Status = exports.GenderEnum = void 0;
const zod_1 = require("zod");
// Enum same as your Gender type
exports.GenderEnum = zod_1.z.enum(["male", "female", "other"]).optional();
exports.Status = zod_1.z.enum(["approved", "pending", "rejected"]).optional();
// Contact Validation
const contactValidationSchema = zod_1.z.object({
    address: zod_1.z.string().min(1, "Address is required").optional(),
    city: zod_1.z.string().min(1, "City is required").optional(),
    state: zod_1.z.string().min(1, "State is required").optional(),
    zipCode: zod_1.z.string().min(1, "Zip code is required").optional(),
});
// Financial Info Validation
const financialInfoValidationSchema = zod_1.z.object({
    income: zod_1.z.number().nonnegative("Income must be positive"),
    landOwned: zod_1.z.number().nonnegative("Land owned must be positive"),
    electricityBill: zod_1.z.number().nonnegative("Electricity bill must be positive"),
    mobileBill: zod_1.z.number().nonnegative("Mobile bill must be positive"),
    existingLoan: zod_1.z.boolean(),
});
// Personal Info Validation
exports.personalInfoValidationSchema = zod_1.z
    .object({
    userId: zod_1.z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid userId (must be MongoDB ObjectId)"),
    firstName: zod_1.z.string().min(1, "First name is required"),
    lastName: zod_1.z.string().min(1, "Last name is required"),
    dateOfBirth: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    }),
    gender: exports.GenderEnum,
    contact: contactValidationSchema,
    financialInfo: financialInfoValidationSchema,
})
    .strict();
exports.requestLoanValidationSchema = zod_1.z
    .object({
    requestLoanAmount: zod_1.z
        .number()
        .min(2)
        .nonnegative("request loan amount must be positive"),
})
    .strict();
exports.updatePersonalInfoValidationSchema = zod_1.z
    .object({
    firstName: zod_1.z.string().min(1, "First name is required").optional(),
    lastName: zod_1.z.string().min(1, "Last name is required").optional(),
    dateOfBirth: zod_1.z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    })
        .optional(),
    gender: exports.GenderEnum.optional(),
    contact: contactValidationSchema.optional(),
})
    .strict();
// Loan Info Validation
exports.approvedLoanValidationSchema = zod_1.z
    .object({
    loanAmount: zod_1.z.number().nonnegative("loan amount must be positive"),
    interestRate: zod_1.z.number().nonnegative("interest rate must be positive"),
    TermMonth: zod_1.z.number().nonnegative("Term Month must be positive"),
    notes: zod_1.z.string().optional(),
    status: zod_1.z.string().optional(),
})
    .strict();
exports.rejectLoanValidationSchema = zod_1.z
    .object({
    rejectedNotes: zod_1.z.string(),
    status: zod_1.z.string().optional(),
})
    .strict();
