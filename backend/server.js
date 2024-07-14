const express = require('express');
const cors = require('cors');
const fetchPythPrice = require('./oracles/pythOracle');
const pythPriceIds = require('./priceIDs/pythPriceIDs')

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());

// Endpoint to fetch price based on cryptocurrency
app.get('/api/price/:crypto', async (req, res) => {
  const { crypto } = req.params;

  // Check if the requested cryptocurrency exists in priceIds
  if (!pythPriceIds[crypto]) {
    return res.status(400).json({ error: 'Invalid cryptocurrency' });
  }
  try {
    // Fetch the latest price using the Price ID from the Pyth network
    const pythPrice = await fetchPythPrice(pythPriceIds[crypto])
    res.json({ pythPrice });
  } catch (error) {
    console.error('Error fetching price: ', error);
    res.status(500).json({ error: 'Failed to fetch price data' });
  }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });