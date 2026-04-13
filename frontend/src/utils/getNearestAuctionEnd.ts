import type { Auction } from "../models/types";

export const getNearestAuctionEnd = (auctions: Auction[]) => {
  if (auctions.length === 0) return 1000 * 60 * 60;

  const activeAuctions: Auction[] = auctions.filter(
    (auction) => auction.hasEnded !== true,
  );

  console.log("active auctions:", [...activeAuctions]);

  activeAuctions.sort((a, b) => a.endDate - b.endDate);

  console.log("sorted auctions:", activeAuctions);

  return activeAuctions[0].endDate - Date.now();
};
