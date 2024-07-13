const express = require('express');
const cors = require('cors');
const { PriceServiceConnection } = require('@pythnetwork/price-service-client');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());

// Initialize Pyth connection
const connection = new PriceServiceConnection("https://hermes.pyth.network");

const priceId = "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43";

// API endpoint to fetch the latest price
app.get('/api/price', async (req, res) => {
  try {
    const prices = await connection.getLatestPriceFeeds([priceId]);
    const price = prices[0].price.price / Math.pow(10, -prices[0].price.expo);
    console.log(prices, price)
    res.json({ price });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch price data' });
  }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });