import { io } from "socket.io-client";
import { createAuctionFeed } from "./landingPage";

// CREATE SOCKET-CLIENT SERVER
const socket = io("http://localhost:3000");

// test för att ta emot data från backend
socket.on("sendTest", (message: string) => {
  console.log(message);
});

// test för att skicka data till backend
socket.emit("receiveTest", "testing from frontend");

// ändra datatyp
// ändra loopen till att presentera html
socket.on("sendAuctions", (auctions: []) => {
  createAuctionFeed(auctions);
});
