const { Client } = require("@bandprotocol/bandchain.js");

// Function to fetch price data from Band's standard dataset
async function fetchBandProtocolPrice(crypto) {
  // BandChain's Proof-of-Authority REST endpoint
  const endpoint = "https://laozi1.bandchain.org/grpc-web";
  const client = new Client(endpoint);
  try {
    const rate = await client.getReferenceData([`${crypto}/USD`]);
    const price = rate[0].rate;
    console.log(price);
    return price;
  } catch (error) {
    console.error("Error fetching Band Protocol data:", error);
    throw error;
  }
}

module.exports = fetchBandProtocolPrice;
