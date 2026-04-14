import { Schema } from "mongoose";

export type Bid = {
  createdBy: string;
  sum: number;
};

export const bidSchema = new Schema(
  {
    createdBy: { type: String, required: true },
    sum: { type: Number, required: true },
  },

);
