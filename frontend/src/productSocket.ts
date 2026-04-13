import { io } from "socket.io-client";
import type { Auction } from "./models/types";
import { displayAuctionDetails } from "../src/utils/productPageUtils";

// Ansluter till servern
const socket = io("http://localhost:3000");

// 2. Hämta ID:t från localStorage
const auctionId = localStorage.getItem("lastClickedAuction");
const userId = sessionStorage.getItem("userId");

// Berättar för backend vem user är så hen kan joina gamla rum
if (userId) {
  socket.emit("joinMyBiddedRooms", userId);
}
if (auctionId) {
  // Gå med i rummet specifikt för denna auktion
  //socket.emit("joinAuctionRoom", auctionId);

  // Begär den initiala datan för den hära auktionen
  socket.emit("sendId", auctionId);
}

// Lyssnar på uppdateringar (skickas via io.to(id).emit från backend)
socket.on("sendSingleAuction", (auction: Auction) => {
  console.log("Real-time update: updating product page with new bid");
  displayAuctionDetails(auction);
});