import {
  AuctionModel,
  convertAuctionToDTO,
  type Auction,
} from "../models/Auction.mjs";

export const createAuction = async (auction: Auction) => {
  return await AuctionModel.create(auction);
};
