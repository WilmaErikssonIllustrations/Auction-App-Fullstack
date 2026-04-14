import { io } from "socket.io-client";
import type { Auction } from "./models/types";
import { displayAuctionDetails } from "../src/utils/productPageUtils";


const socket = io("http://localhost:3000");


const auctionId = localStorage.getItem("lastClickedAuction");
const userId = sessionStorage.getItem("userId");


if (userId) {
  socket.emit("joinMyBiddedRooms", userId);
}
if (auctionId) {

  socket.emit("sendId", auctionId);
}

socket.on("sendSingleAuction", (auction: Auction) => {
  console.log("Real-time update: updating product page with new bid");
  displayAuctionDetails(auction);
});