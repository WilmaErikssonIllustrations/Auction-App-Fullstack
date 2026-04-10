import { io } from "socket.io-client";
import type { Auction } from "./models/types";
import { displayAuctionDetails } from "../src/utils/productPageUtils";

// CREATE SOCKET-CLIENT SERVER
const socket = io("http://localhost:3000");

socket.emit("sendId", localStorage.getItem("lastClickedAuction"));

socket.on("sendSingleAuction", (auction: Auction) => {
  displayAuctionDetails(auction);
});
