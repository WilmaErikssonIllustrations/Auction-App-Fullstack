import { model, Schema, type InferSchemaType } from "mongoose";
import { bidSchema, type Bid } from "./Bid.mjs";

export type Auction = {
  title: string;
  description: string;
  image: string;
  bids: Bid[];
  endDate: number;
  hasEnded: boolean;
  winner?: Bid | null;
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
    winner: { type: bidSchema },
    startingBid: { type: Number, required: true },
    createdBy: { type: String, required: true },
  },
  { timestamps: true },
);

// export type AuctionFromDB = InferSchemaType<typeof auctionSchema>;

// export type AuctionDTO = Auction & { id: string | undefined };

// export const convertAuctionToDTO = (auction: AuctionFromDB): AuctionDTO => {
//   const auctionDTO = {
//     ...auction,
//     id: auction.id?.toString(),
//     winner: auction.winner ?? null,
//   };
//   return auctionDTO;
// };

export const AuctionModel = model("auction", auctionSchema);
