import type { Auction, NewAuctionFormData } from "../models/types";
import { hasAuctionEnded } from "./hasAuctionEnded";
import { checkLoggedInUser } from "./checkLoggedInUser";
import { getUsername } from "./getUsername";

// Create Auction Form
const displayFormButton = document.getElementById("displayFormButton");
const createAuctionForm = document.getElementById("createAuctionForm");

displayFormButton?.addEventListener("click", () => {
  toggleAuctionForm();
});

createAuctionForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const loggedInUser = await checkLoggedInUser();
  if (!loggedInUser) return;
  console.log("loggedin user:", loggedInUser);

  const titleInput = document.getElementById("title") as HTMLInputElement;
  const imageInput = document.getElementById("image") as HTMLInputElement;
  const descriptionInput = document.getElementById(
    "description",
  ) as HTMLInputElement;
  const startingBidInput = document.getElementById(
    "startingBid",
  ) as HTMLInputElement;
  const daysToEnd = document.getElementById("daysToEnd") as HTMLInputElement;

  const newAuction: NewAuctionFormData = {
    title: titleInput.value,
    description: descriptionInput.value,
    image: imageInput.value,
    startingBid: +startingBidInput.value,
    bids: [],
    daysToEnd: +daysToEnd.value,
    createdBy: loggedInUser.id,
  };

  const response = await fetch("http://localhost:3000/auctions", {
    method: "POST",
    headers: { "Content-Type": "application/JSON" },
    body: JSON.stringify(newAuction),
  });

  if (response.ok) {
    console.log("SUCCESS:", await response.json());
    createAuctionForm?.classList.toggle("hide");
  } else {
    console.log("ERROR", response);
  }
});

function toggleAuctionForm() {
  if (!displayFormButton) return;
  createAuctionForm?.classList.toggle("hide");
  if (createAuctionForm?.classList.contains("hide")) {
    displayFormButton.innerText = "Ny auktion";
  } else {
    displayFormButton.innerText = "Dölj";
  }
}

// Auction Feed
export const createAuctionFeed = (auctions: Auction[]) => {
  const auctionContainer = document.getElementById("auctionContainer");
  if (!auctionContainer) return;
  auctionContainer.innerHTML = "";

  auctions.forEach(async (auction) => {
    const auctionElement = await createAuction(auction);
    auctionContainer.append(auctionElement);
  });
};

const createAuction = async (auction: Auction) => {
  const loggedInUser = await checkLoggedInUser();

  const container = document.createElement("div");
  const title = document.createElement("h4");
  const image = document.createElement("span");
  const description = document.createElement("p");
  const startingBid = document.createElement("p");
  const highestBidSum = document.createElement("p");
  const highestBidLeader = document.createElement("p");
  const isHighestBidLeader = document.createElement("p");
  const createdBy = document.createElement("p");
  const endDate = document.createElement("p");

  title.innerHTML = "Rubrik: " + auction.title;
  image.innerHTML = "Bild-url: " + auction.image;
  description.innerHTML = "Beskrivning: " + auction.description;

  if (loggedInUser?.id === auction.createdBy) {
    createdBy.innerHTML = "Det här är din auktion";
  } else {
    const auctionCreator = await getUsername(auction.createdBy);
    if (auctionCreator) {
      createdBy.innerHTML = "Säljs av: " + auctionCreator.name;
    } else {
      createdBy.innerHTML = "Säljs av användaren med ID: " + auction.createdBy;
    }
  }

  const calculatedEndDate = new Date(auction.endDate).toLocaleString("se-SV");
  const auctionHasEnded = hasAuctionEnded(auction.endDate);

  if (auctionHasEnded) {
    endDate.innerHTML = "Auktionen slutfördes: " + calculatedEndDate;
  } else {
    endDate.innerHTML = "Auktionen slutar: " + calculatedEndDate;
  }

  container.className = "auction";

  if (auction.bids.length > 0) {
    const sortedBids = auction.bids.sort((a, b) => {
      if (a.sum > b.sum) return 1;
      if (a.sum < b.sum) return -1;
      return 0;
    });
    highestBidSum.innerHTML = "Högsta bud: " + sortedBids[0].sum.toString();
    highestBidLeader.innerHTML =
      (auctionHasEnded ? "Vann" : "Leder") +
      " auktionen: " +
      sortedBids[0].createdBy; // det här ska ändras så att det visar budgivarens användarnamn

    if (loggedInUser?.id === sortedBids[0].createdBy) {
      isHighestBidLeader.innerHTML = "Du leder budgivningen";
    }
  } else {
    startingBid.innerHTML = "Utropspris: " + auction.startingBid + " kr";
  }

  container.append(
    title,
    image,
    description,
    startingBid,
    highestBidLeader,
    highestBidSum,
    isHighestBidLeader,
    endDate,
    createdBy,
  );

  return container;
};
