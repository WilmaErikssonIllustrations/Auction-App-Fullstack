import type { NewAuctionFormData } from "./models/types";

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
