import express, { json } from "express";
import cors from "cors";
import { config } from "dotenv";

config();
const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(json);

app.listen(port, () => {
  try {
    console.log("Api running on port", port);
  } catch (error) {}
});
