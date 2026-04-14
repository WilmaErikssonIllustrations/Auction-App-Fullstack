import type { Auction } from "../models/types";
import socket from "../productSocket";
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
  const highestBidSum = document.createElement("p");
  const auctionLeader = document.createElement("p");

  const auctionLeaderUser = await getAuctionLeader(auction);

  title.textContent = auction.title;
  description.textContent = auction.description;
  image.textContent = auction.image;
  auctionLeader.textContent = auctionLeaderUser
    ? "Auction leader: " + auctionLeaderUser.name
    : "";

  if (auction.bids.length > 0) {
    const sortedBids = auction.bids.sort((a, b) => {
      if (a.sum < b.sum) return 1;
      if (a.sum > b.sum) return -1;
      return 0;
    });

    highestBidSum.textContent = "Högsta bud: " + sortedBids[0].sum.toString();
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

  const user = await getUser();

  if (!user) {
    bidInput.disabled = true;
    submitButton.disabled = true;
  } else if (user.id === auction.createdBy) {
    bidInput.disabled = true;
    submitButton.disabled = true;
  }

  bidForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const bidInputValue = bidInput.value;

    if (user) {
      console.log("this user is making a fetch", user);
      try {
        await fetch("http://localhost:3000/auctions/" + auction._id, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            createdBy: user.id,
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
    window.history.back();
  });

  container.append(
    title,
    description,
    image,
    highestBidSum,
    auctionLeader,
    bidForm,
    goBackButton,
  );
  auctionContainer.appendChild(container);
};
