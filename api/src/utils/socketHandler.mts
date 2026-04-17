import { Server, Socket } from "socket.io";
import { User } from "../models/User.mjs";
import {
  getAuctionById,
  getAuctions,
} from "../controllers/auctionController.mjs";

export const setupSocketHandlers = (io: Server) => {
  io.on("connection", (socket: Socket) => {

    socket.on("joinMyBiddedRooms", async (userId: string) => {
      try {
        if (!userId) return;
        const user = await User.findById(userId);
        if (user && user.auctionHasBiddedOn) {
          user.auctionHasBiddedOn.forEach((auctionId: string) => {
            socket.join(auctionId);
          });
        }
      } catch (error) {
        console.error("Fel vid joinMyBiddedRooms:", error);
      }
    });

    socket.on("readyForSingleAuction", async (id: string) => {
      const auction = await getAuctionById(id);
      socket.emit("sendSingleAuction", auction);
    });

    socket.on("readyForAuctions", async () => {
      socket.emit("sendAuctions", await getAuctions());
    });

    socket.on("disconnect", () => {
    });

    socket.on("joinLeaderRoom", async (userId: string, auctionId: string) => {
      try {
        if (!userId) return;

        io.socketsLeave("leader" + auctionId);

        socket.join("leader" + auctionId);

      } catch (error) {
        console.error("Fel vid joinLeaderRoom:", error);
      }
    });
  });
};
