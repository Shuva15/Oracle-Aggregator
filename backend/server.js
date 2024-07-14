const express = require("express");
const cors = require("cors");
const fetchPythPrice = require("./oracles/pythOracle");
const fetchChainlinkPrice = require("./oracles/chainlinkOracle");
const fetchBandProtocolPrice = require("./oracles/bandOracle");
const pythPriceIds = require("./priceIDs/pythPriceIDs");
const chainlinkPriceIds = require("./priceIDs/chainlinkPriceIDs");
const calculateAveragePrice = require("./utils/calculateAveragePrice");

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());

// Endpoint to fetch price based on cryptocurrency
app.get("/api/price/:crypto", async (req, res) => {
  const { crypto } = req.params;

  // Check if the requested cryptocurrency exists in priceIds
  if (!pythPriceIds[crypto]) {
    return res.status(400).json({ error: "Invalid cryptocurrency" });
  }
  try {
    // Fetch the latest price using the Price ID from the Pyth network
    const pythPrice = await fetchPythPrice(pythPriceIds[crypto]);
    // Fetch the latest price using the Price ID from the chainlink network
    const chainlinkPrice = await fetchChainlinkPrice(
      `https://rpc.ankr.com/eth`,
      chainlinkPriceIds[crypto]
    );
    // Fetch the latest from the Band Protocol
    const bandPrice = await fetchBandProtocolPrice(crypto);

    // Calculate the average price
    const averagePrice = calculateAveragePrice([
      pythPrice,
      chainlinkPrice,
      bandPrice,
    ]);

    res.json({ averagePrice, pythPrice, chainlinkPrice, bandPrice });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch price data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
