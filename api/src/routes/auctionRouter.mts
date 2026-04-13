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

/**
 * Tar emot formData från användaren och skapar en ny auktion.
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
    res.status(500).json({
      message: "something went wrong creating the auction",
      error: error,
    });
  }
});

/**
 * takes a bid from the user and sends to addBid
 * sends the updatedAuction as a response
 * innan bud läggs validerar att ägare inte är samma som budgivare, annars skickar error
 */
auctionRouter.patch("/:id", async (req: Request, res: Response) => {

  try {
    // kastar 'req.params' för att TS ska veta att 'id' är en string
    const { id } = req.params as { id: string };
    const { createdBy, sum } = req.body; // 'createdBy' är budgivaren

    // Hämtar auktionen för att hitta ägaren
    const auction = await getAuctionById(id);

    if (!auction) {
      return res.status(404).send("Auction not found");
    }

    // Kontrollerar att användaren inte budar på sin egen auktion
    if (auction.createdBy.toString() === createdBy.toString()) {
      return res.status(403).json({
        message: "You cannot bid on your own auction.",
      });
    }

    // Försöker lägga till budet
    const response = await addBid(id, createdBy, Number(sum));

    if (response) {
      // Uppdaterar usern som lagt budet i databasen
      // // findByIdAndUpdate letar upp användaren via deras ID (createdBy)
      await User.findByIdAndUpdate(createdBy, {
        // $addToSet lägger till auktionens ID i arrayen 'auctionHasBiddedOn'
        // men ENDAST om det inte redan finns där (förhindrar dubbletter).
        $addToSet: { auctionHasBiddedOn: id }
      }, {});
      res.status(201).json(response);
      // Skicka ut uppdateringen via Socket.io
      // Vi hämtar den uppdaterade auktionen
      const updatedAuction = await getAuctionById(id);

      // Vi skickar ENDAST till de som joinat rummet för just detta ID
      io.to(id).emit("sendSingleAuction", updatedAuction);
    } else {
      res.status(400).send("Could not update auction");
    }
  } catch (error: unknown) {
    console.error("Error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";

    res.status(500).json({
      message: "Something went wrong updating the auction",
      error: errorMessage,
    });
  }
});