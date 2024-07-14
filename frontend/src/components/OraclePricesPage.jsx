import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const OraclePricesPage = () => {
  let { cryptoFromUrl } = useParams();
  const [averagePrice, setAveragePrice] = useState(null);
  const [oraclePrices, setOraclePrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPrice = async (crypto) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/price/${crypto}`);
      setAveragePrice(response.data.averagePrice);
      const pythPrice = response.data.pythPrice;
      const chainlinkPrice = response.data.chainlinkPrice;
      const bandPrice = response.data.bandPrice;

      setOraclePrices([
        { oracleName: 'Pyth Oracle', price: pythPrice },
        { oracleName: 'Chainlink', price: chainlinkPrice },
        { oracleName: 'Band Protocol', price: bandPrice}
      ]);
    } catch (error) {
      setError('Failed to fetch prices');
      console.log(cryptoFromUrl)
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrice(cryptoFromUrl);
  }, []);

  return (
    <div className="min-h-screen bg-[#DEF9C4] text-gray-800 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-4xl font-bold mb-6 text-center text-[#468585]">
          Prices from Oracles
        </h1>
        {loading ? (
          <p className="text-center text-[#2f5757]">Loading...</p>
        ) : error ? (
          <p className="text-center text-[#dd4141]">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-[#50B498] text-[#2a4f4f]">
                <tr>
                  <th className="px-4 py-2">Cryptocurrency</th>
                  <th className="px-4 py-2">Oracle Provider</th>
                  <th className="px-4 py-2">Price</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center">
                  <td className="border px-4 py-2 font-bold" rowSpan={oraclePrices.length + 1}>
                    {cryptoFromUrl}
                  </td>
                  <td className="border px-4 py-2 font-semibold">{oraclePrices[0]?.oracleName}</td>
                  <td className="border px-4 py-2">${oraclePrices[0]?.price}</td>
                </tr>
                {oraclePrices.slice(1).map((oracle, index) => (
                  <tr key={index + 1} className="text-center">
                    <td className="border px-4 py-2 font-semibold">{oracle.oracleName}</td>
                    <td className="border px-4 py-2">${oracle.price}</td>
                  </tr>
                ))}
                <tr className="text-center">
                  <td className="border px-4 py-2 font-semibold">Average Price</td>
                  <td className="border px-4 py-2">${averagePrice}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OraclePricesPage;