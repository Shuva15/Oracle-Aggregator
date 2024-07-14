import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCrypto, setSelectedCrypto] = useState('ETH'); // Default to BTC

  const fetchPrice = async (crypto) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/price/${crypto}`);
      setPrice(response.data.pythPrice);
      setLoading(false);
      console.log(response, price)
    } catch (error) {
      setError('Failed to fetch price data');
      console.log(error)
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrice(selectedCrypto); // Fetch price initially
    const interval = setInterval(() => fetchPrice(selectedCrypto), 30000); // Refresh price every 30 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [selectedCrypto]);

  const handleCryptoChange = (e) => {
    setSelectedCrypto(e.target.value); // Update selected crypto when dropdown changes
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col justify-center items-center">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Oracle Aggregator</h1>
        <div className="mb-4">
          <label htmlFor="crypto-select" className="block text-gray-700 mb-2">Select Cryptocurrency:</label>
          <select
            id="crypto-select"
            value={selectedCrypto}
            onChange={handleCryptoChange} // Handle dropdown change
            className="w-full border-gray-300 rounded-md shadow-sm"
          >
            <option value="BTC">Bitcoin (BTC)</option>
            <option value="ETH">Ethereum (ETH)</option>
            {/* Add more options for other cryptocurrencies as needed */}
          </select>
        </div>
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="text-center">
            <h2 className="text-3xl font-semibold mb-2">{selectedCrypto}/USD: ${price}</h2>
            <p className="text-gray-500 mt-2">Updated every 30 seconds</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;