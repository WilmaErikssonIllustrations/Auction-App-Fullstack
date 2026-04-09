import express from "express";
import {
  createAuction,
  getAuctions,
} from "../controllers/auctionController.mjs";
import { io } from "../index.mjs";

export const auctionRouter = express.Router();

/**
 * takes the formData from the user and sends to createAuction
 * sends the created Auction as a response
 */
auctionRouter.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      image,
      bids,
      startingBid,
      daysToEnd,
      createdBy,
    } = req.body;

    // Datum i ms som är idag + daysToEnd
    const endDate = Date.now() + 1000 * 60 * 60 * 24 * +daysToEnd;

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
      io.emit("sendAuctions", await getAuctions());
    } else {
      res.status(400).send("Could not create auction");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "something went wrong", error: error });
  }
});
