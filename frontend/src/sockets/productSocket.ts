import { io } from "socket.io-client";
import type { Auction } from "../models/types";
import { displayAuctionDetails } from "../utils/pageUtils/productPageUtils";
import { checkAuctionLeader } from "../utils/checkAuctionLeader";
import { createOverbidMessage } from "../utils/createOverbidMessage";

const socket = io("http://localhost:3000");

const auctionId = localStorage.getItem("lastClickedAuction");
const userId = sessionStorage.getItem("userId");

if (userId) {
  socket.emit("joinMyBiddedRooms", userId);
}
if (auctionId) {
  socket.emit("readyForSingleAuction", auctionId);
}

socket.on("sendSingleAuction", (auction: Auction) => {
  displayAuctionDetails(auction);
  const bidLeader = checkAuctionLeader(auction, userId);

  if (bidLeader && userId) {
    socket.emit("joinLeaderRoom", userId, auction._id);
  }
});

socket.on("sendLeaderMessage", (msg: string) => {
  createOverbidMessage(msg);
});

export default socket;
