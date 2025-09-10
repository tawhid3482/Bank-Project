import { model, Schema } from "mongoose";
import {
  Gender,
  TContact,
  TFinancialInfo,
  TPersonalInfo,
} from "./info.interface";

const contactSchema = new Schema<TContact>(
  {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
  },
  {
    _id: false,
  }
);

const financialInfoSchema = new Schema<TFinancialInfo>(
  {
    income: { type: Number, required: true },
    landOwned: { type: Number, required: true },
    electricityBill: { type: Number, required: true },
    mobileBill: { type: Number, required: true },
    existingLoan: { type: Number, required: true },
  },
  {
    _id: false,
  }
);

const personalInfoSchema = new Schema<TPersonalInfo>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    gender: {
      type: String,
      enum: Object.values(Gender),
    },
    contact: contactSchema,
    financialInfo: financialInfoSchema,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const personalInfo = model<TPersonalInfo>(
  "PersonalInfo",
  personalInfoSchema
);
