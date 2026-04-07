import express, { json } from "express";
import cors from "cors";
import { config } from "dotenv";
import mongoose from "mongoose";

config();
const port = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "";
if (!MONGO_URI) throw new Error("No connection string found");

const app = express();
app.use(cors());
app.use(json);

app.listen(port, async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Mongoose connection state:", mongoose.connection.readyState); // 1 means connected
    console.log("Api running on port", port);
  } catch (error) {}
});
