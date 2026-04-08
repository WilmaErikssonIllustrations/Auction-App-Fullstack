import type { Auction, NewAuctionFormData } from "./models/types";

// Create Auction Form
const displayFormButton = document.getElementById("displayFormButton");
const createAuctionForm = document.getElementById("createAuctionForm");

displayFormButton?.addEventListener("click", () => {
  toggleAuctionForm();
});

createAuctionForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const titleInput = document.getElementById("title") as HTMLInputElement;
  const imageInput = document.getElementById("image") as HTMLInputElement;
  const descriptionInput = document.getElementById(
    "description",
  ) as HTMLInputElement;
  const startingBidInput = document.getElementById(
    "startingBid",
  ) as HTMLInputElement;
  const endDateInput = document.getElementById("endDate") as HTMLInputElement;

  const newAuction: NewAuctionFormData = {
    title: titleInput.value,
    description: descriptionInput.value,
    image: imageInput.value,
    startingBid: +startingBidInput.value,
    bids: [],
    endDate: +endDateInput.value,
    createdBy: "random users name",
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

  auctions.forEach((auction) => {
    const auctionElement = createAuction(auction);
    auctionContainer.append(auctionElement);
  });
};

const createAuction = (auction: Auction) => {
  const container = document.createElement("div");
  const title = document.createElement("h4");
  const image = document.createElement("span");
  const description = document.createElement("p");
  const highestBidSum = document.createElement("p");
  const highestBidLeader = document.createElement("p");
  const createdBy = document.createElement("p");
  const endDate = document.createElement("p");

  title.innerHTML = "Rubrik: " + auction.title;
  image.innerHTML = "Bild-url: " + auction.image;
  description.innerHTML = "Beskrivning: " + auction.description;
  createdBy.innerHTML = "Säljs av: " + auction.createdBy;
  endDate.innerHTML = "Auktionen slutar: " + auction.endDate;

  container.className = "auction";

  if (auction.bids.length > 0) {
    const sortedBids = auction.bids.sort((a, b) => {
      if (a.sum > b.sum) return 1;
      if (a.sum < b.sum) return -1;
      return 0;
    });
    highestBidSum.innerHTML = "Högsta bud: " + sortedBids[0].sum.toString();
    highestBidLeader.innerHTML = "Leder auktionen: " + sortedBids[0].createdBy;
  }

  container.append(
    title,
    description,
    image,
    highestBidLeader,
    highestBidSum,
    endDate,
    createdBy,
  );

  return container;
};
