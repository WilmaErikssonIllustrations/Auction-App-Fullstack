import { AuctionModel, type Auction } from "../models/Auction.mjs";
import type { Bid } from "../models/Bid.mjs";
import { checkHasEnded } from "../utils/checkHasEnded.js";

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

  auctions.forEach(async (auction) => {
    auction.hasEnded = checkHasEnded(auction);
    await auction.save();
  });

  return auctions;
};

/**
 *
 * @param id id of the auction
 * @returns auction
 */
export const getAuctionById = async (id: string) => {
  const auction = await AuctionModel.findById(id);
  if (!auction) return false;
  auction.hasEnded = checkHasEnded(auction);

  await auction.save();

  return auction;
};

/**
 *
 * @param id id of the auction
 * @param createdBy id of the bidder
 * @param sum sum of the bid
 * @returns false or the auction
 */
export const addBid = async (id: string, createdBy: string, sum: number) => {
  const auction = await AuctionModel.findById(id);
  if (!auction) return false;

  const newBid: Bid = {
    createdBy: createdBy,
    sum: sum,
  };

  auction.bids.push(newBid);
  await auction.save();

  return auction;
};
