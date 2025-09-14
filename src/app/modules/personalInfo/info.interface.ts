import { Types } from "mongoose";

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}
export enum Status {
  approved = "approved",
  pending = "pending",
  rejected = "rejected",
}

export interface TContact {
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface TFinancialInfo {
  income: number;
  landOwned: number;
  electricityBill: number;
  mobileBill: number;
  existingLoan: boolean;
}

export interface TAnnualRange {
  annualIncome: number;
  annualElectricityBill: number;
  annualMobileBill: number;
}

export interface TApproved {
  loanAmount: number;
  interestRate: number;
  TermMonth: number;
  notes?: string;

}

export interface TPersonalInfo {
  userId: Types.ObjectId;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  contact: TContact;
  financialInfo: TFinancialInfo;
  requestLoanAmount?: number;
  isApproved?: TApproved;
  rejectedNotes?: string;
  creditScore?: string;
  debtToIncomeRatio?: string;
  totalDebt?: number;
  monthlyIncome?: number;
  annualInfo?: TAnnualRange;
  status: Status
}
