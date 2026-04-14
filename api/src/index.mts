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

app.use("/auctions", auctionRouter);
app.use("/api/users", userRouter);
app.use("/login", loginRouter);

export const server = createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

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
