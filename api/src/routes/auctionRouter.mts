import express, { type Request, type Response } from "express";
import {
  addBid,
  createAuction,
  getAuctionById,
  getAuctions,
} from "../controllers/auctionController.mjs";
import { io } from "../index.mjs";
import { User } from "../models/User.mjs";

export const auctionRouter = express.Router();


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

    const endDate = Date.now() + 1000 * 60 * 60 * 24 * +daysToEnd;

    const response = await createAuction({
      createdBy: createdBy,
      title: title,
      description: description,
      image: image,
      bids: bids,
      startingBid: startingBid,
      endDate: endDate,
      hasEnded: false,
    });

    if (response) {
      res.status(201).json(response);
      io.emit("sendAuctions", await getAuctions());
    } else {
      res.status(400).send("Could not create auction");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "something went wrong creating the auction",
      error: error,
    });
  }
});

auctionRouter.patch("/:id", async (req: Request, res: Response) => {
  try {

    const { id } = req.params as { id: string };
    const { createdBy, sum } = req.body;

    const auction = await getAuctionById(id);

    if (!auction) {
      return res.status(404).send("Auction not found");
    }


    if (auction.createdBy.toString() === createdBy.toString()) {
      return res.status(403).json({
        message: "You cannot bid on your own auction.",
      });
    }


    const highestBid = auction.bids.length > 0 ? Math.max(...auction.bids.map((bid) => bid.sum)) : auction.startingBid;

    if (Number(sum) <= highestBid) {
      return res.status(400).json({
        message: `Your bid must be higher than the current highest bid of ${highestBid}.`,
      });
    }

    // Försöker lägga till budet
    const response = await addBid(id, createdBy, Number(sum));

    if (response) {

      await User.findByIdAndUpdate(
        createdBy,
        {
          $addToSet: { auctionHasBiddedOn: id },
        },
        {},
      );

      const updatedAuction = await getAuctionById(id);

      io.to(id).emit("sendSingleAuction", updatedAuction);
    } else {
      res.status(400).send("Could not update auction");
    }
  } catch (error: unknown) {
    console.error("Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    res.status(500).json({
      message: "Something went wrong updating the auction",
      error: errorMessage,
    });
  }
});
