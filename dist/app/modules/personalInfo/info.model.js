"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.personalInfo = void 0;
const mongoose_1 = require("mongoose");
const info_interface_1 = require("./info.interface");
const contactSchema = new mongoose_1.Schema({
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
}, {
    _id: false,
});
const financialInfoSchema = new mongoose_1.Schema({
    income: { type: Number, required: true },
    landOwned: { type: Number, required: true },
    electricityBill: { type: Number, required: true },
    mobileBill: { type: Number, required: true },
    existingLoan: { type: Boolean, required: true },
}, {
    _id: false,
});
const annualRangeInfoSchema = new mongoose_1.Schema({
    annualIncome: { type: Number, required: true },
    annualElectricityBill: { type: Number, required: true },
    annualMobileBill: { type: Number, required: true },
}, {
    _id: false,
});
const isApprovedSchema = new mongoose_1.Schema({
    loanAmount: { type: Number, required: true },
    interestRate: { type: Number, required: true },
    TermMonth: { type: Number, required: true },
    notes: { type: String },
}, {
    _id: false,
});
const personalInfoSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    gender: {
        type: String,
        enum: Object.values(info_interface_1.Gender),
    },
    contact: contactSchema,
    financialInfo: financialInfoSchema,
    isApproved: isApprovedSchema,
    rejectedNotes: { type: String },
    creditScore: { type: String },
    debtToIncomeRatio: { type: String },
    totalDebt: { type: Number },
    requestLoanAmount: { type: Number },
    monthlyIncome: { type: Number },
    annualInfo: annualRangeInfoSchema,
    status: {
        type: String,
        enum: Object.values(info_interface_1.Status),
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.personalInfo = (0, mongoose_1.model)("PersonalInfo", personalInfoSchema);
