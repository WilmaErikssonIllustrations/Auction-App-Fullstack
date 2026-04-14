import type { Auction, NewAuctionFormData } from "../models/types";
import { getUser } from "./getUser";

console.log("Tid om 60 sek", Date.now() + 1000 * 60);
console.log("Tid om 90 sek", Date.now() + 1000 * 90);

const displayFormButton = document.getElementById("displayFormButton");
const createAuctionForm = document.getElementById("createAuctionForm");
const createAuctionButton = document.getElementById(
  "createAuctionButton",
) as HTMLButtonElement;

const loggedInUser = await getUser();

if (!loggedInUser) {
  createAuctionButton.disabled = true;
}

displayFormButton?.addEventListener("click", () => {
  toggleAuctionForm();
});

createAuctionForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!loggedInUser) return;

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
  const loggedInUser = await getUser();

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

  title.addEventListener("click", () => {
    localStorage.setItem("lastClickedAuction", auction._id);
    window.location.href = "/productPage";
  });

  title.innerHTML = "Rubrik: " + auction.title;
  image.innerHTML = "Bild-url: " + auction.image;
  description.innerHTML = "Beskrivning: " + auction.description;

  if (loggedInUser?.id === auction.createdBy) {
    createdBy.innerHTML = "Det här är din auktion";
    createdBy.classList.add("yourAuction");
  } else {
    const auctionCreator = await getUser(auction.createdBy);
    if (auctionCreator) {
      createdBy.innerHTML = "Säljs av: " + auctionCreator.name;
    } else {
      createdBy.innerHTML = "Säljs av användaren med ID: " + auction.createdBy;
    }
  }

  const calculatedEndDate = new Date(auction.endDate).toLocaleString("se-SV");

  if (auction.hasEnded) {
    endDate.innerHTML = "Auktionen slutfördes: " + calculatedEndDate;
    endDate.classList.add("endedAuction");
  } else {
    endDate.innerHTML = "Auktionen slutar: " + calculatedEndDate;
  }

  container.className = "auction";

  if (auction.bids.length > 0) {
    const sortedBids = auction.bids.sort((a, b) => {
      if (a.sum < b.sum) return 1;
      if (a.sum > b.sum) return -1;
      return 0;
    });
    const auctionLeader = await getUser(sortedBids[0].createdBy);
    highestBidSum.innerHTML = "Högsta bud: " + sortedBids[0].sum.toString();
    highestBidLeader.innerHTML =
      (auction.hasEnded ? "Vann" : "Leder") +
      " auktionen: " +
      auctionLeader?.name;

    if (loggedInUser?.id === sortedBids[0].createdBy) {
      isHighestBidLeader.innerHTML = "Du leder budgivningen";
      isHighestBidLeader.classList.add("yourAuction");
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
