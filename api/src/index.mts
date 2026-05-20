import express, { json } from "express";
import cors from "cors";
import { config } from "dotenv";
import mongoose from "mongoose";
import { createServer } from "node:http";
import { auctionRouter } from "./routes/auctionRouter.mjs";
import { userRouter } from "./routes/userRouter.mjs";
import { loginRouter } from "./routes/loginRouter.mjs";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import { setupSocketHandlers } from "./utils/socketHandler.mjs";
import type { Auction } from "./models/Auction.mjs";
import { auth } from "./middlewares/auth.mjs";

config();
const port = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "";
if (!MONGO_URI) throw new Error("No connection string found");

export const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", "https://auction-app-fullstack.netlify.app"], 
    credentials: true,
  }),
);
app.use(json());
app.use(cookieParser());

app.use("/auctions", auth, auctionRouter);
app.use("/api/users", userRouter);
app.use("/login", loginRouter);

export const server = createServer(app);

export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://auction-app-fullstack.netlify.app"], // <-- BYT UT till din riktiga Netlify-länk här
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// io.on("connection", async (socket) => {
//   console.log("user connected", socket.id);

//   // Denna lyssnare körs när en inloggad användare ansluter.
//   // Den ser till att användaren "prenumererar" på uppdateringar för alla auktioner de budat på tidigare.
//   socket.on("joinMyBiddedRooms", async (userId: string) => {
//     try {
//       if (!userId) return;

//       // Hämtar användaren från databasen för att se deras historik
//       const user = await User.findById(userId);

//       // Om användaren finns och har en lista med auktions-ID:n
//       if (user && user.auctionHasBiddedOn) {
//         /// Vi loopar igenom alla ID:n i arrayen och ansluter denna socket till varje rums-ID.
//         // Detta gör att användaren får realtids-uppdateringar även för auktioner de inte tittar på just nu.
//         user.auctionHasBiddedOn.forEach((auctionId: string) => {
//           socket.join(auctionId);
//         });

//         console.log(
//           `Socket ${socket.id} (User: ${userId}) joinade ${user.auctionHasBiddedOn.length} historiska rum.`,
//         );
//       }
//     } catch (error) {
//       console.error("Fel vid joinMyBiddedRooms:", error);
//     }
//   });

//   socket.on("sendId", async (id: string) => {
//     const auction = await getAuctionById(id);
//     socket.emit("sendSingleAuction", auction);
//   });

//   socket.on("readyForAuctions", async () => {
//     // Denna lyssnare körs när en användare går in på en specifik auktionssida.
//     //socket.on("joinAuctionRoom", (auctionId: string) => {
//     // Ansluter socketen till ett rum döpt efter auktionens ID.
//     // Detta gör att vi kan skicka bud-uppdateringar specifikt till de som tittar på just denna auktion.
//     //  socket.join(auctionId);
//     //  console.log(`Användare ${socket.id} gick med i rum: ${auctionId}`);
//     //});

//     socket.emit("sendAuctions", await getAuctions());
//     // Lyssnar på när en användare kopplar ifrån (stänger fliken, tappar internet etc.)
//     socket.on("disconnect", () => {
//       // Socket.io tar automatiskt bort användaren från alla rum (rooms) den joinat,
//       // så vi behöver inte rensa bort dem från auktionerna manuellt här. Men kom ihåg att historiken finns ju kvar i databasen så den försvinner inte!
//       console.log("user disconnected");
//     });
//   });

//   socket.on("joinLeaderRoom", async (userId: string, auctionId: string) => {
//     try {
//       if (!userId) return;

//       console.log(
//         "User: " +
//           userId +
//           "is joining the leader room for auction: " +
//           auctionId,
//       );
//       io.socketsLeave("leader" + auctionId);

//       socket.join("leader" + auctionId);
//       console.log(
//         `Socket ${socket.id} (User: ${userId}) joinade ledarrummet för auktion med id ${auctionId}.`,
//       );
//     } catch (error) {
//       console.error("Fel vid joinLeaderRoom:", error);
//     }
//   });

//   socket.on("test", (msg: string) => {
//     console.log(msg);
//   });
// });
setupSocketHandlers(io);

server.listen(port, async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Mongoose connection state:", mongoose.connection.readyState);
  } catch (error) {
    console.error("Error connection to database: ", error);
  }
  console.log(`Server listening on http://localhost:${port}`);
});
