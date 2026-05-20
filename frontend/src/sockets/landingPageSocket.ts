import { io } from "socket.io-client";
import { createAuctionFeed } from "../utils/pageUtils/landingPageUtils";
import type { Auction } from "../models/types";
import { getNearestAuctionEnd } from "../utils/getNearestAuctionEnd";

export const socket = io("https://auction-app-fullstack.onrender.com");

socket.emit("readyForAuctions");

let timeUntilUpdate: number = 1000 * 60 * 60;
let timeout: number;

socket.on("sendAuctions", (auctions: Auction[]) => {
  createAuctionFeed(auctions);
  timeUntilUpdate = getNearestAuctionEnd(auctions); // after update this function returns -47

  updateSetTimeout(timeUntilUpdate);
});

const updateSetTimeout = (timeUntilUpdate: number) => {
  if (timeout) clearTimeout(timeout);

  timeout = window.setTimeout(
    () => {
      socket.emit("readyForAuctions");
    },
    Math.max(timeUntilUpdate, 2000),
  );
};
