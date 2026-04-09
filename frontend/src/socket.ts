import { io } from "socket.io-client";
import { createAuctionFeed } from "./utils/landingPageUtils";
import type { Auction } from "./models/types";

// CREATE SOCKET-CLIENT SERVER
export const socket = io("http://localhost:3000");

// ändra datatyp
// ändra loopen till att presentera html
socket.on("sendAuctions", (auctions: Auction[]) => {
  createAuctionFeed(auctions);
});
