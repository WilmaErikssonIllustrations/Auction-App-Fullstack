export const hasAuctionEnded = (endDate: number) => {
  const todaysDate = Date.now();
  if (endDate > todaysDate) return false;
  return true;
};
