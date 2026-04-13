import express, { json } from "express";
import cors from "cors";
import { config } from "dotenv";
import mongoose from "mongoose";
import { createServer } from "node:http";
import { auctionRouter } from "./routes/auctionRouter.mjs";
import { userRouter } from "./routes/userRouter.mjs";
import { loginRouter } from "./routes/loginRouter.mjs";
import {
  getAuctionById,
  getAuctions,
} from "./controllers/auctionController.mjs";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import { User } from "./models/User.mjs";

config();
const port = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "";
if (!MONGO_URI) throw new Error("No connection string found");

export const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(json());
app.use(cookieParser());

// API ENDPOINTS //
app.use("/auctions", auctionRouter);
app.use("/api/users", userRouter);
app.use("/login", loginRouter);

// CREATE AND START SOCKET SERVER //
export const server = createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Better than "*" for security
  },
});

io.on("connection", async (socket) => {
  console.log("user connected", socket.id);

  // Denna lyssnare körs när en inloggad användare ansluter.
  // Den ser till att användaren "prenumererar" på uppdateringar för alla auktioner de budat på tidigare.
  socket.on("joinMyBiddedRooms", async (userId: string) => {
    try {
      if (!userId) return;

      // Hämtar användaren från databasen för att se deras historik
      const user = await User.findById(userId);

      // Om användaren finns och har en lista med auktions-ID:n
      if (user && user.auctionHasBiddedOn) {
        /// Vi loopar igenom alla ID:n i arrayen och ansluter denna socket till varje rums-ID.
        // Detta gör att användaren får realtids-uppdateringar även för auktioner de inte tittar på just nu.
        user.auctionHasBiddedOn.forEach((auctionId: string) => {
          socket.join(auctionId);
        });

        console.log(`Socket ${socket.id} (User: ${userId}) joinade ${user.auctionHasBiddedOn.length} historiska rum.`);
      }
    } catch (error) {
      console.error("Fel vid joinMyBiddedRooms:", error);
    }
  });

  socket.on("sendId", async (id: string) => {
    const auction = await getAuctionById(id);
    socket.emit("sendSingleAuction", auction);
  });

  socket.on("readyForAuctions", async () => {
    // Denna lyssnare körs när en användare går in på en specifik auktionssida.
    //socket.on("joinAuctionRoom", (auctionId: string) => {
    // Ansluter socketen till ett rum döpt efter auktionens ID.
    // Detta gör att vi kan skicka bud-uppdateringar specifikt till de som tittar på just denna auktion.
    //  socket.join(auctionId);
    //  console.log(`Användare ${socket.id} gick med i rum: ${auctionId}`);
    //});

    socket.emit("sendAuctions", await getAuctions());
    // Lyssnar på när en användare kopplar ifrån (stänger fliken, tappar internet etc.)
    socket.on("disconnect", () => {
      // Socket.io tar automatiskt bort användaren från alla rum (rooms) den joinat,
      // så vi behöver inte rensa bort dem från auktionerna manuellt här. Men kom ihåg att historiken finns ju kvar i databasen så den försvinner inte!
      console.log("user disconnected");
    });
  });
});

server.listen(port, async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Mongoose connection state:", mongoose.connection.readyState); // 1 means connected
  } catch (error) {
    console.error("Error connection to database: ", error);
  }
  console.log(`Server listening on http://localhost:${port}`);
});
