import { model, Schema, type InferSchemaType } from "mongoose";
import { bidSchema, type Bid } from "./Bid.mjs";

export type Auction = {
  title: string;
  description: string;
  image: string;
  bids: Bid[];
  endDate: number;
  hasEnded: boolean;
  startingBid: number;
  createdBy: string;
};

const auctionSchema = new Schema(
  {
    id: { type: Schema.ObjectId },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    bids: { type: [bidSchema], required: true },
    endDate: { type: Number, required: true },
    hasEnded: { type: Boolean, required: true },
    startingBid: { type: Number, required: true },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }, //timestamps ger automatiskt createdAt och updatedAt
);

export type AuctionFromDB = InferSchemaType<typeof auctionSchema>;
// tror inte det behövs någon DTO här eftersom det inte är någon hemlig data vi skickar till frontend
// men däremot vill man se att man har åtkomst till createdAt och updatedAt via timestamps

export type AuctionDTO = Auction & { id: string | undefined };

export const convertAuctionToDTO = (auction: AuctionFromDB): AuctionDTO => {
  const auctionDTO = { ...auction, id: auction.id?.toString() };
  return auctionDTO;
};

export const AuctionModel = model("auction", auctionSchema);
