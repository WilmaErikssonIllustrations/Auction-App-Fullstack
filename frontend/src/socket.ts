import { io } from "socket.io-client";
import { createAuctionFeed } from "./utils/landingPageUtils";
import type { Auction } from "./models/types";
import { getNearestAuctionEnd } from "./utils/getNearestAuctionEnd";


export const socket = io("http://localhost:3000");

socket.emit("readyForAuctions");

let timeUntilUpdate: number = 1000 * 60 * 60;
let timeout: number;

socket.on("sendAuctions", (auctions: Auction[]) => {
  createAuctionFeed(auctions);
  timeUntilUpdate = getNearestAuctionEnd(auctions);

  updateSetTimeout(timeUntilUpdate);
});

// funkar första gången men setTimeout körs inte efter det
const updateSetTimeout = (timeUntilUpdate: number) => {
  if (timeout) clearTimeout(timeout);

  timeout = setTimeout(() => {
    socket.emit("readyForAuctions");
  }, timeUntilUpdate);
};
