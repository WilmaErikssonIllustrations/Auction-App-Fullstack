import express, { json } from "express";
import cors from "cors";
import { config } from "dotenv";
import mongoose from "mongoose";
import { createServer } from "node:http";
import { makeConnection } from "./sockets/socket.mjs";
import { auctionRouter } from "./routes/auctionRouter.mjs";
import { userRouter } from "./routes/userRouter.mjs";
import { loginRouter } from "./routes/loginRouter.mjs";
import cookieParser from "cookie-parser";

config();
const port = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "";
if (!MONGO_URI) throw new Error("No connection string found");

export const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(json());
app.use(cookieParser());

// API ENDPOINTS //
app.use("/auctions", auctionRouter);
app.use("/api/users", userRouter);

app.use("/login", loginRouter);

// CREATE AND START SOCKET SERVER //
export const server = createServer(app);

makeConnection(server);

server.listen(port, async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Mongoose connection state:", mongoose.connection.readyState); // 1 means connected
  } catch (error) {
    console.error("Error connection to database: ", error);
  }
  console.log(`Server listening on http://localhost:${port}`);
});
