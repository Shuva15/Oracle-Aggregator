const express = require("express");
const cors = require("cors");
const fetchPythPrice = require("./oracles/pythOracle");
const pythPriceIds = require("./priceIDs/pythPriceIDs");
const fetchChainlinkPrice = require("./oracles/chainlinkOracle");
const chainlinkPriceIds = require("./priceIDs/chainlinkPriceIDs");
const chainlinkProviderExtensions = require("./utils/chainlinkProviderExtensions");
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
      `https://rpc.ankr.com/${chainlinkProviderExtensions[crypto]}`,
      chainlinkPriceIds[crypto]
    );

    // Calculate the average price
    const averagePrice = calculateAveragePrice([pythPrice, chainlinkPrice]);

    res.json({ averagePrice, pythPrice, chainlinkPrice });

    console.log(
      "pythPrice is " +
        pythPrice +
        ". chainlinkPrice is " +
        chainlinkPrice +
        ". The average is " +
        averagePrice
    );
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch price data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});