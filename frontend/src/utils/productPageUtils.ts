import type { Auction } from "../models/types";
import { getAuctionLeader } from "./getAuctionLeader";
import { getUser } from "./getUser";

const auctionContainer = document.getElementById("auctionContainer");

export const displayAuctionDetails = async (auction: Auction) => {
  if (!auctionContainer) return;

  auctionContainer.innerHTML = "";

  const container = document.createElement("div");
  const title = document.createElement("h4");
  const description = document.createElement("p");
  const image = document.createElement("span");
  const startingBid = document.createElement("p");
  const highestBidSum = document.createElement("p");
  const auctionLeader = document.createElement("p");
  const highestBidLeader = document.createElement("p");
  const isHighestBidLeader = document.createElement("p");
  const createdBy = document.createElement("p");

  const auctionLeaderUser = await getAuctionLeader(auction);

  title.innerHTML = "Rubrik: " + auction.title;
  image.innerHTML = "Bild-url: " + auction.image;
  description.innerHTML = "Beskrivning: " + auction.description;
  auctionLeader.textContent = auctionLeaderUser
    ? "Leder auktionen: " + auctionLeaderUser.name
    : "";

  const loggedInUser = await getUser();

  if (auction.bids.length > 0) {
    const sortedBids = auction.bids.sort((a, b) => {
      if (a.sum < b.sum) return 1;
      if (a.sum > b.sum) return -1;
      return 0;
    });
    const auctionLeader = await getUser(sortedBids[0].createdBy);
    highestBidSum.innerHTML =
      "Högsta bud: " + sortedBids[0].sum.toString() + " kr";
    highestBidLeader.innerHTML =
      (auction.hasEnded ? "Vann" : "Leder") +
      " auktionen: " +
      auctionLeader?.name;

    if (loggedInUser?.id === sortedBids[0].createdBy) {
      isHighestBidLeader.innerHTML = "Du leder budgivningen";
    }
  } else {
    startingBid.innerHTML = "Utropspris: " + auction.startingBid + " kr";
  }

  if (loggedInUser?.id === auction.createdBy) {
    createdBy.innerHTML = "Det här är din auktion";
  } else {
    const auctionCreator = await getUser(auction.createdBy);
    if (auctionCreator) {
      createdBy.innerHTML = "Säljs av: " + auctionCreator.name;
    } else {
      createdBy.innerHTML = "Säljs av användaren med ID: " + auction.createdBy;
    }
  }

  const bidForm = document.createElement("form");
  const bidInput = document.createElement("input");
  bidInput.type = "number";
  bidInput.name = "bidAmount";
  bidInput.placeholder = "Ange ditt bud";
  bidInput.required = true;

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.textContent = "Lägg bud";

  bidForm.append(bidInput, submitButton);
  bidForm.id = "bidForm";

  if (!loggedInUser) {
    bidInput.disabled = true;
    submitButton.disabled = true;
  } else if (loggedInUser.id === auction.createdBy) {
    bidInput.disabled = true;
    submitButton.disabled = true;
  }

  bidForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const bidInputValue = bidInput.value;

    if (loggedInUser) {
      try {
        await fetch("http://localhost:3000/auctions/" + auction._id, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            createdBy: loggedInUser.id,
            sum: bidInputValue,
          }),
        });
      } catch (error) {
        console.error(error);
      }
    }
  });

  const goBackButton = document.createElement("button");
  goBackButton.textContent = "Gå tillbaka";
  goBackButton.addEventListener("click", () => {
    window.location.href = "/";
  });

  container.append(
    title,
    description,
    image,
    highestBidSum,
    highestBidLeader,
    isHighestBidLeader,
    startingBid,
    createdBy,
    bidForm,
    goBackButton,
  );
  auctionContainer.appendChild(container);
};
