import type { Auction } from "../models/types";

export const checkAuctionLeader = (auction: Auction, userId: string | null) => {
  if (auction.bids.length <= 0) {
    return false;
  }
  auction.bids.sort((a, b) => b.sum - a.sum);

  return auction.bids[0].createdBy === userId;
};
