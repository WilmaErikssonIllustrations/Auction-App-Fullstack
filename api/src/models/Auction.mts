export type Auction = {
  title: string;
  description: string;
  image: string;
  bids: []; // Bid[]
  createdBy: string; //user id from mongo
};

// Move this to another file
/**
 * export type Bid = {
 * createdBy: string,
 * sum: number
 * }
 */
