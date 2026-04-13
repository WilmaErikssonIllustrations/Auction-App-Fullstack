import { User } from "../models/User.mjs";

export const createUser = async (
  name: string,
  email: string,
  password: string,
) => {
  return await User.create({ name, email, password });
};

export const findUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};

export const findUserById = async (id: string) => {
  return await User.findById(id);
};
