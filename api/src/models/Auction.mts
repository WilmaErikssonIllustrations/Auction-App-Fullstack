import type { Bid } from "./Bid.mjs";

export type Auction = {
  title: string;
  description: string;
  image: string;
  bids: Bid[];
  createdBy: string; //user id from mongo
  hasEnded: boolean;
};
