import { TUser } from "./user.interface";
import { User } from "./user.model";

const createUserService = async (payload: TUser) => {
  const user = await User.create(payload);
  return user;
};

const getAllUsersFromDB = async () => {
  const user = await User.find({});

  const totalUsers = await User.countDocuments();

  return {
    data: user,
    meta: {
      total: totalUsers,
    },
  };
};

export const userServices = {
  createUserService,
  getAllUsersFromDB,
};
