import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import OraclePricesPage from './components/OraclePricesPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
      <Route index element={<Home />} />
      <Route path="/:cryptoFromUrl" element={<OraclePricesPage />} /> 
      </Routes>
    </BrowserRouter>
  );
};

export default App;