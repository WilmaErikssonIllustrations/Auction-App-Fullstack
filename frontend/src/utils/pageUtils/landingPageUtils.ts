import type { Auction, NewAuctionFormData } from "../../models/types";
import { getUser, type UserInfo } from "../getUser";
import { uploadImage } from "./uploadImage";

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

  const image = await uploadImage(imageInput);

  const newAuction: NewAuctionFormData = {
    title: titleInput.value,
    description: descriptionInput.value,
    image: image.url,
    startingBid: +startingBidInput.value,
    bids: [],
    daysToEnd: +daysToEnd.value,
    createdBy: loggedInUser.id,
  };

  const response = await fetch("https://auction-app-fullstack.onrender.com/auctions", {
    method: "POST",
    headers: { "Content-Type": "application/JSON" },
    body: JSON.stringify(newAuction),
    credentials: "include",
  });

  if (response.ok) {
    createAuctionForm?.classList.toggle("hide");
    displayFormButton!.innerText = "+";
  } else {
    console.error("ERROR", response);
  }
});

function toggleAuctionForm() {
  if (!displayFormButton) return;
  createAuctionForm?.classList.toggle("hide");
  if (createAuctionForm?.classList.contains("hide")) {
    displayFormButton.innerText = "+";
  } else {
    displayFormButton.innerText = "-";
  }
}

export const createAuctionFeed = async (auctions: Auction[]) => {
  const auctionContainer = document.getElementById("auctionContainer");
  if (!auctionContainer) return;
  auctionContainer.innerHTML = "";

  const loggedInUser = await getUser();

  for (const auction of auctions) {
    await createAuction(auction, loggedInUser);
  }
};

const createAuction = async (
  auction: Auction,
  loggedInUser: UserInfo | null,
) => {
  const container = document.createElement("div");
  const title = document.createElement("h4");
  const image = document.createElement("img");
  const description = document.createElement("p");
  const startingBid = document.createElement("p");
  const highestBidSum = document.createElement("p");
  const highestBidLeader = document.createElement("p");
  const isHighestBidLeader = document.createElement("p");
  const createdBy = document.createElement("p");
  const endDate = document.createElement("p");

  image.src = auction.image;
  image.alt = auction.image;
  image.classList.add("auctionImage");

  container.addEventListener("click", () => {
    localStorage.setItem("lastClickedAuction", auction._id);
    window.location.href = "/productPage.html";
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

  const auctionContainer = document.getElementById("auctionContainer");
  if (!auctionContainer) return;

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

  auctionContainer.append(container);

  return container;
};
