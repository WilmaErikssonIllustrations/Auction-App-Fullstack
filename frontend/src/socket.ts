import { io } from "socket.io-client";
import { createAuctionFeed } from "./utils/landingPageUtils";
import type { Auction } from "./models/types";
import { getNearestAuctionEnd } from "./utils/getNearestAuctionEnd";

// CREATE SOCKET-CLIENT SERVER
export const socket = io("http://localhost:3000");

socket.emit("readyForAuctions");

let timeUntilUpdate: number = 1000 * 60 * 60; //uppdaterar sidan senast efter en timma
let timeout: number;

console.log("tid om 1 min", Date.now() + 60000);
console.log("tid om 1min 30 sek", Date.now() + 90000);

socket.on("sendAuctions", (auctions: Auction[]) => {
  createAuctionFeed(auctions);
  timeUntilUpdate = getNearestAuctionEnd(auctions);
  console.log("seconds left until update", timeUntilUpdate / 1000);

  updateSetTimeout(timeUntilUpdate);
});

// funkar första gången men setTimeout körs inte efter det
const updateSetTimeout = (timeUntilUpdate: number) => {
  if (timeout) clearTimeout(timeout);

  timeout = setTimeout(() => {
    console.log("start of timeOut func");

    socket.emit("readyForAuctions");

    console.log("Site will update again in:", timeUntilUpdate / 1000); // det här blir fel
  }, timeUntilUpdate);
};
