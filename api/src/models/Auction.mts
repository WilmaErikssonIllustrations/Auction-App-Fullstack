import mongoose, { model, Schema, type InferSchemaType } from "mongoose";
import { bidSchema } from "./Bid.mjs";

// den här behövs nog inte. kanske för att validera inkommande data
// export type Auction = {
//   title: string;
//   description: string;
//   image: string;
//   bids: Bid[];
//   hasEnded: boolean;
// };

const auctionSchema = new Schema({
  id: { type: Schema.ObjectId, required: true }, //id här ska kanske inte vara required, vi testar och ser
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  bids: { type: [bidSchema], required: true },
  hasEnded: { type: Boolean, required: true },
});

export type AuctionFromDB = InferSchemaType<typeof auctionSchema>;
// tror inte det behövs någon DTO här eftersom det inte är någon hemlig data vi skickar till frontend

export const Auction = model("auction", auctionSchema);
