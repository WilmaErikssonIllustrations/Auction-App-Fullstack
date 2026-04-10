import type { Auction } from "./models/types";

const auctionContainer = document.getElementById("auctionContainer");

const displayAuctionDetails = (auction: Auction) => {

    if (!auctionContainer) return;

    const container = document.createElement("div");
    const title = document.createElement("h4");
    const description = document.createElement("p");
    const image = document.createElement("span");
    const highestBidSum = document.createElement("p");
    
    title.textContent = auction.title;
    description.textContent = auction.description;
    image.textContent = auction.image;

    if (auction.bids.length > 0) {
        const sortedBids = auction.bids.sort((a, b) => {
            if (a.sum > b.sum) return 1;
            if (a.sum < b.sum) return -1;
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
    bidForm.addEventListener("submit", async (event) => { 
        event.preventDefault();
        // Här behövs det läggas in fetch
    });

    container.append(title, description, image, highestBidSum, bidForm);
    auctionContainer.appendChild(container);
}

