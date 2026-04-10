export type Bid = {
  createdBy: string;
  sum: number;
};

export type Auction = {
  title: string;
  description: string;
  image: string;
  bids: Bid[];
  endDate: number;
  startingBid: number;
  createdBy: string;
  _id: string;
};

export type NewAuctionFormData = {
  title: string;
  description: string;
  image: string;
  bids: Bid[];
  daysToEnd: number;
  startingBid: number;
  createdBy: string;
};
