import type { Auction } from "../models/types";

export const getNearestAuctionEnd = (auctions: Auction[]) => {
  if (auctions.length === 0) return 1000 * 60 * 60;

  const activeAuctions: Auction[] = auctions.filter(
    (auction) => auction.hasEnded !== true,
  );

  activeAuctions.sort((a, b) => a.endDate - b.endDate);
  return activeAuctions[0].endDate - Date.now();
};
