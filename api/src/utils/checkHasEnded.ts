import type { Auction } from "../models/Auction.mjs";

export const checkHasEnded = (auction: Auction) => {
  const now = Date.now();
  if (auction.endDate > now) return false;
  return true;
};
