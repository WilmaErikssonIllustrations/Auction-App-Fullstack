import { Server } from "socket.io";
import { server } from "../index.mjs";
import { getAuctions } from "../controllers/auctionController.mjs";

/**
 * creates connection with frontend socket server
 * tests connection in "sendTest" and "receiveTest"
 * emits auctions in "sendAuctions"
 */
export const makeConnection = () => {
  const io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", async (socket) => {
    console.log("user connected");
    io.emit("sendTest", "this is a test emit from backend");

    io.emit("sendAuctions", await getAuctions());

    socket.on("receiveTest", (message: string) => {
      console.log("message:", message);
    });
  });
};
