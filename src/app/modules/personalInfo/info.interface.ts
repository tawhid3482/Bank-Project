import { Types } from "mongoose";

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
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
  existingLoan: number;
}

export interface TPersonalInfo {
  userId:Types.ObjectId;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  contact: TContact;
  financialInfo: TFinancialInfo;
}
