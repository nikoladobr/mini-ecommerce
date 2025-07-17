import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductListPage from './ProductListPage';
import ProductDetailsPage from './ProductDetailsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductListPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
