import { Server, Socket } from "socket.io";
import { User } from "../models/User.mjs";
import {
  getAuctionById,
  getAuctions,
} from "../controllers/auctionController.mjs";

export const setupSocketHandlers = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("user connected", socket.id);

    socket.on("joinMyBiddedRooms", async (userId: string) => {
      try {
        if (!userId) return;
        const user = await User.findById(userId);
        if (user && user.auctionHasBiddedOn) {
          user.auctionHasBiddedOn.forEach((auctionId: string) => {
            socket.join(auctionId);
          });
          console.log(
            `Socket ${socket.id} (User: ${userId}) joinade ${user.auctionHasBiddedOn.length} rum.`,
          );
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
      console.log("user disconnected", socket.id);
    });

    socket.on("joinLeaderRoom", async (userId: string, auctionId: string) => {
      try {
        if (!userId) return;

        console.log(
          "User: " +
            userId +
            "is joining the leader room for auction: " +
            auctionId,
        );
        io.socketsLeave("leader" + auctionId);

        socket.join("leader" + auctionId);
        console.log(
          `Socket ${socket.id} (User: ${userId}) joinade ledarrummet för auktion med id ${auctionId}.`,
        );
      } catch (error) {
        console.error("Fel vid joinLeaderRoom:", error);
      }
    });
  });
};
