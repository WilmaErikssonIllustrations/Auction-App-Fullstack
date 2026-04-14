import type { Auction } from "../models/Auction.mjs";

export const addWinner = (auction: Auction) => {
  if (auction.winner?.createdBy) return false;
  auction.bids.sort((a, b) => b.sum - a.sum);
  return auction.bids[0];
};
