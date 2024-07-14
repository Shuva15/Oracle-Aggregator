import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCrypto, setSelectedCrypto] = useState("SOL");

  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/${selectedCrypto}`);
  };

  const fetchPrice = async (crypto) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/price/${crypto}`
      );
      setPrice(response.data.averagePrice);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch price data");
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrice(selectedCrypto); // Fetch price initially
    const interval = setInterval(() => fetchPrice(selectedCrypto), 5000); // Refresh price every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [selectedCrypto]);

  const handleCryptoChange = (e) => {
    setSelectedCrypto(e.target.value); // Update selected crypto when dropdown changes
  };

  return (
    <div className="min-h-screen bg-[#DEF9C4] text-gray-800 flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-[#468585] mt-10">
        Oracle Aggregator
      </h1>

      <div className="w-3/4 bg-white shadow-lg rounded-lg p-10 mt-10 flex flex-col items-center">
        <p className="text-lg mb-6 text-center">
          This project is an{" "}
          <span className="font-semibold text-[#468585]">
            Oracle Aggregator
          </span>{" "}
          that collects prices of cryptocurrencies from different oracles and
          shows the average.
          <br />
          <span className="font-semibold text-[#468585] cursor-pointer">
            Click
          </span>{" "}
          on the <span className="font-semibold text-[#468585]">price</span> to
          see individual oracle prices for that coin.
        </p>

        <div className="flex justify-center mb-6 ">
          <label
            htmlFor="crypto-select"
            className="block p-3 mb-2 text-lg font-semibold text-[#468585]"
          >
            Select Cryptocurrency:
          </label>
          <select
            id="crypto-select"
            value={selectedCrypto}
            onChange={handleCryptoChange} // Handle dropdown change
            className="p-3 rounded-lg font-semibold bg-[#50B498] text-[#2a4f4f] focus:outline-none cursor-pointer"
          >
            <option value="ETH">Ethereum (ETH)</option>
            <option value="BTC">Bitcoin (BTC)</option>
            <option value="SOL">Solana (SOL)</option>
            <option value="MATIC">Polygon (MATIC)</option>
            <option value="BNB">Binance Coin (BNB)</option>
            <option value="LINK">Chainlink (LINK)</option>
            <option value="DAI">Dai (DAI)</option>
            <option value="SAND">The Sandbox (SAND)</option>
            <option value="UNI">Uniswap (UNI)</option>
            {/* Add more options for other cryptocurrencies as needed */}
          </select>
        </div>

        <div className="text-center">
          <div
            onClick={handleClick}
            className="p-4 bg-[#9CDBA6] rounded-lg cursor-pointer hover:bg-[#50B498] transition-colors text-center min-w-40"
          >
            <h2 className="text-2xl font-bold text-[#2f5757]">
              {selectedCrypto}
            </h2>
            {loading ? (
              <p className="text-center text-[#2f5757]">Loading...</p>
            ) : error ? (
              <p className="text-center text-[#dd4141]">{error}</p>
            ) : (
              <p className="text-xl text-[#2f5757]">${price}</p>
            )}
          </div>
          <p className="text-[#98ae83] font-extralight text-center">
            Price updates every 5 seconds
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
