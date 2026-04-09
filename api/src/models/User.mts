import mongoose, { Schema, type InferSchemaType } from "mongoose";

const userSchema = new mongoose.Schema({
  _id: { type: Schema.ObjectId },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const User = mongoose.model("User", userSchema);

// export type UserType = {
//   name: string;
//   email: string;
// };

export type UserDTO = {
  name: string;
  email: string;
  id: string | undefined;
};

export type UserFromDB = InferSchemaType<typeof userSchema>;

// Ändra User till UserFromDB och lägg till id när schema och model är skapat
export const convertUserToDTO = (user: UserFromDB): UserDTO => {
  return {
    id: user._id?.toString(),
    name: user.name,
    email: user.email,
  };
};
