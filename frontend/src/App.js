import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [price, setPrice] = useState(null);

  useEffect(() => {
    const fetchPrice = async () => {
      const response = await axios.get(`http://localhost:5000/api/price`);
        setPrice(response.data.price);
    };

    fetchPrice();
}, []);

  return (
    <div>
      <div>
        <h1>Oracle Aggregator</h1>
          <div>
            <h2 className="text-3xl font-semibold mb-2">BTC/USD: ${price}</h2>
          </div>
      </div>
    </div>
  );
}

export default App;
