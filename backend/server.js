const express = require('express');
const cors = require('cors');
const { PriceServiceConnection } = require('@pythnetwork/price-service-client');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());

// Initialize Pyth connection
const connection = new PriceServiceConnection("https://hermes.pyth.network");

const priceIds = {
  BTC: "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43",
  ETH: "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
}

// Endpoint to fetch price based on cryptocurrency
app.get('/api/price/:crypto', async (req, res) => {
  const { crypto } = req.params;

  // Check if the requested cryptocurrency exists in priceIds
  if (!priceIds[crypto]) {
    return res.status(400).json({ error: 'Invalid cryptocurrency' });
  }
  try {
    // Fetch the latest price using the Price ID from the Pyth network
    const prices = await connection.getLatestPriceFeeds([priceIds[crypto]]);
    const price = prices[0].price.price / Math.pow(10, -prices[0].price.expo);
    res.json({ price });
  } catch (error) {
    console.error('Error fetching price:', error);
    res.status(500).json({ error: 'Failed to fetch price data' });
  }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });