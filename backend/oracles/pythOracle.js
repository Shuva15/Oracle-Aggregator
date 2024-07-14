const { PriceServiceConnection } = require("@pythnetwork/price-service-client");

const fetchPythPrice = async (priceIds) => {
  // Initialize Pyth connection
  const connection = new PriceServiceConnection("https://hermes.pyth.network");
  const prices = await connection.getLatestPriceFeeds([priceIds]);
  const price = prices[0].price.price / Math.pow(10, -prices[0].price.expo);
  return price;
};

module.exports = fetchPythPrice;
