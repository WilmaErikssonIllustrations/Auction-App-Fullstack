import express from "express";
import { createAuction } from "../controllers/auctionController.mjs";

export const auctionRouter = express.Router();

auctionRouter.post("/", async (req, res) => {
  try {
    const { title, description, image, bids, startingBid, endDate, createdBy } =
      req.body;

    const response = await createAuction({
      createdBy: createdBy,
      title: title,
      description: description,
      image: image,
      bids: bids,
      startingBid: startingBid,
      endDate: endDate,
    });

    if (response) {
      res.status(201).json(response);
    } else {
      res.status(400).send("Could not create auction");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "something went wrong", error: error });
  }
});
