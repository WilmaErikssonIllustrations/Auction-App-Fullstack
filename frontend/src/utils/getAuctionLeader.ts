import type { Auction } from "../models/types";
import { getUser } from "./getUser";

export const getAuctionLeader = async (auction: Auction) => {
  if (auction.bids.length <= 0) {
    return null;
  }

  const sortedBids = auction.bids.sort((a, b) => b.sum - a.sum);

  const user = await getUser(sortedBids[0].createdBy);
  return user;
};
