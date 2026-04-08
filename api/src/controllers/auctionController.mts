import { AuctionModel, type Auction } from "../models/Auction.mjs";

/**
 *
 * @param auction an auction object from the user
 * @returns the same object but with _id
 */
export const createAuction = async (auction: Auction) => {
  return await AuctionModel.create(auction);
};

/**
 *
 * @returns the first 5 auctions from the database
 */
export const getAuctions = async () => {
  const auctions = await AuctionModel.find();
  const maxLimitAuctions = auctions.slice(0, 5);
  return maxLimitAuctions;
};
