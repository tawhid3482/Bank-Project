/* eslint-disable @typescript-eslint/consistent-type-definitions */

import { Types } from "mongoose";

export enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    USER = "USER",
    ADMIN = "ADMIN"
}

export enum IsActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
} 

export type TUser = {
  _id?:string
  phone: string;
  email: string;
  password: string;
  role: Role;
  isDeleted?: boolean;
  isActive?:IsActive ;
  loan?:Types.ObjectId[]
  isOTPVerified?:boolean
}
