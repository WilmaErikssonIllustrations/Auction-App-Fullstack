import { Server } from "socket.io";
import { Server as HttpServer } from "node:http";
import { getAuctions } from "../controllers/auctionController.mjs";

/**
 * creates connection with frontend socket server
 * tests connection in "sendTest" and "receiveTest"
 * emits auctions in "sendAuctions"
 */
export const makeConnection = (httpServer: HttpServer) => {
  // Use the httpServer passed in as an argument
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173" // Better than "*" for security
    }
  });

  io.on("connection", async (socket) => {
    console.log("user connected");
    io.emit("sendTest", "this is a test emit from backend");

    io.emit("sendAuctions", await getAuctions());

    socket.on("receiveTest", (message: string) => {
      console.log("message:", message);
    });
  });
};
