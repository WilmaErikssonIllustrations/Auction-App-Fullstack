import { AuctionModel, type Auction } from "../models/Auction.mjs";
import type { Bid } from "../models/Bid.mjs";

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
  return await AuctionModel.find();
};

/**
 *
 * @param id id of the auction
 * @param createdBy id of the bidder
 * @param sum sum of the bid
 */
export const addBid = async (id: string, createdBy: string, sum: number) => {
  const auction = await AuctionModel.findById(id);
  if (!auction) return false;

  const newBid: Bid = {
    createdBy: createdBy,
    sum: sum,
  };

  auction.bids.push(newBid);
  auction.save();

  return auction;
};
