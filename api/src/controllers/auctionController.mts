import { getDefaultResultOrder } from "node:dns";
import { AuctionModel, type Auction } from "../models/Auction.mjs";
import type { Bid } from "../models/Bid.mjs";
import { addWinner } from "../utils/addWinner.js";
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
 * gets the auctions from the database
 * runs them through hasEnded and addWinner filters
 * updates the auctions in the database
 * @returns the auctions
 */
export const getAuctions = async () => {
  const auctions = await AuctionModel.find();

  auctions.forEach(async (auction) => {
    const auctionHasEnded = checkHasEnded(auction);
    const result = addWinner(auction);
    if (auctionHasEnded && result) {
      await AuctionModel.findOneAndUpdate(
        { _id: auction._id },
        { winner: result, hasEnded: true },
        {
          returnDocument: "after",
        },
      );
    } else {
      await AuctionModel.findOneAndUpdate(
        { _id: auction._id },
        { hasEnded: auctionHasEnded },
        {
          returnDocument: "after",
        },
      );
    }
  });
  const updatedAuctions = await AuctionModel.find();

  return updatedAuctions;
};

/**
 * gets the auction from the database
 * runs it through hasEnded and addWinner filters
 * updates the auction in the database
 * @param id id of the auction
 * @returns auction
 */
export const getAuctionById = async (id: string) => {
  const auction = await AuctionModel.findById(id);
  if (!auction) return false;

  const auctionHasEnded = checkHasEnded(auction);
  const result = addWinner(auction);
  if (auctionHasEnded && result) {
    // auction.winner = result;
    await AuctionModel.findOneAndUpdate(
      { _id: auction.id },
      { winner: result, hasEnded: true },
      {
        returnDocument: "after",
      },
    );
  } else {
    await AuctionModel.findOneAndUpdate(
      { _id: auction.id },
      { hasEnded: auctionHasEnded },
      {
        returnDocument: "after",
      },
    );
  }

  const updatedAuction = await AuctionModel.findById(id);

  return updatedAuction;
};

/**
 *
 * @param id id of the auction
 * @param createdBy id of the bidder
 * @param sum sum of the bid
 * @returns the auction
 */
export const addBid = async (id: string, createdBy: string, sum: number) => {
  return await AuctionModel.findOneAndUpdate(
    { _id: id },
    { $push: { bids: { createdBy, sum } } },
    {
      returnDocument: "after",
    },
  );
};
