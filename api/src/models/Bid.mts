import { Schema } from "mongoose";

// export type Bid = {
//   createdBy: string; //user id from mongo
//   sum: number;
// };

export const bidSchema = new Schema(
  {
    id: { type: Schema.ObjectId, required: true }, //id här ska kanske inte vara required, vi testar och ser
    createdBy: { type: String, required: true },
    sum: { type: Number, required: true },
  },
  { timestamps: true }, //timestamps ger automatiskt createdAt och updatedAt
);
