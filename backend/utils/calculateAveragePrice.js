// function to calculate the average price
const calculateAveragePrice = (prices) => {
  const total = prices.reduce((sum, price) => sum + price, 0);
  return total / prices.length;
};

module.exports = calculateAveragePrice;
