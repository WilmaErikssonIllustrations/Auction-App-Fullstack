import express, { json } from "express";
import cors from "cors";
import { config } from "dotenv";
import mongoose from "mongoose";
import { createServer } from "node:http";
import { makeConnection } from "./sockets/socket.mjs";
import { auctionRouter } from "./routes/auctionRouter.mjs";

config();
const port = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "";
if (!MONGO_URI) throw new Error("No connection string found");

export const app = express();
app.use(cors());
app.use(json());

app.use("/auctions", auctionRouter);

export const server = createServer(app);

server.listen(port, async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Mongoose connection state:", mongoose.connection.readyState); // 1 means connected
  } catch (error) {
    console.error("Error connection to database: ", error);
  }
  console.log("Socket server running on port", port);
});

// this function listens for user connections
makeConnection();
