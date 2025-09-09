import { model, Schema } from "mongoose";
import { IsActive, Role, TUser } from "./user.interface";

const userSchema = new Schema<TUser>(
  {
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    isDeleted: { type: Boolean, default: false },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = model<TUser>("User", userSchema);
