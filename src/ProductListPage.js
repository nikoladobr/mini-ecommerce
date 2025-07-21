import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from './context/CartContext';
import './ProductListPage.css';

function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState(searchParams.get('view') || 'grid');
  const [sortOption, setSortOption] = useState(searchParams.get('sort') || '');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [itemsPerPage, setItemsPerPage] = useState(Number(searchParams.get('perPage')) || 5);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [quantities, setQuantities] = useState({});

  const { addToCart } = useCart();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await axios.get('https://localhost:7047/api/products');
      return res.data;
    },
  });

  useEffect(() => {
    setSearchParams({
      page: currentPage,
      perPage: itemsPerPage,
      sort: sortOption,
      view: viewMode,
    });
  }, [currentPage, itemsPerPage, sortOption, viewMode, setSearchParams]);

  const handleQuantityChange = useCallback((productId, value) => {
    const num = parseInt(value) || 1;
    setQuantities((q) => ({ ...q, [productId]: num < 1 ? 1 : num }));
  }, []);

  const handleAddToCart = useCallback((product) => {
    const quantity = quantities[product.id] || 1;
    addToCart(product, quantity);
  }, [addToCart, quantities]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error while loading products.</p>;
  if (!Array.isArray(data)) return <p>Wrong format.</p>;

  const filteredData = data.filter((p) =>
    p.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortOption) {
      case 'priceAsc':
        return a.price - b.price;
      case 'priceDesc':
        return b.price - a.price;
      case 'nameAsc':
        return a.name.localeCompare(b.name);
      case 'nameDesc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="product-page">
      <div className="top-bar">
        <div className="sort-search-toggle">
          <p className="result-count">
            Showing {paginatedData.length} out of {filteredData.length}
          </p>

          <select value={sortOption} onChange={(e) => {
            setSortOption(e.target.value);
            setCurrentPage(1);
          }}>
            <option value="">Sort</option>
            <option value="priceAsc">Price: Ascending</option>
            <option value="priceDesc">Price: Descending</option>
            <option value="nameAsc">Name: A → Z</option>
            <option value="nameDesc">Name: Z → A</option>
          </select>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
          />
          {searchTerm && <button onClick={() => setSearchTerm('')}>Obriši</button>}

          <div className="view-toggle">
            <button onClick={() => setViewMode('grid')} disabled={viewMode === 'grid'}>☷</button>
            <button onClick={() => setViewMode('list')} disabled={viewMode === 'list'}>≣</button>
          </div>
        </div>
      </div>

      <div className="content-wrapper">
        <aside className="sidebar" />

        <main className="main-content">
          <div className="toolbar-top">
            <label>
              Products per page:
              <select value={itemsPerPage} onChange={(e) => {
                setItemsPerPage(parseInt(e.target.value));
                setCurrentPage(1);
              }}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </select>
            </label>
          </div>

          <div className={`product-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
            {paginatedData.length === 0 ? (
              <p>No available products.</p>
            ) : (
              paginatedData.map((proizvod) => {
                const glavnaSlika = proizvod.images?.find(img => !img.includes('.1.')) || proizvod.images?.[0] || 'images/placeholder.jpg';
                const imagePath = `/${glavnaSlika}`;

                return (
                  <div key={proizvod.id} className={`product-card ${viewMode === 'list' ? 'list' : ''}`}>
                    <Link to={`/products/${proizvod.id}`} className="product-link">
                      <img
                        src={imagePath}
                        alt={proizvod.name}
                        style={{ width: '120px', height: '120px', objectFit: 'contain', alignSelf: 'center', marginBottom: '16px' }}
                      />
                      <h3>{proizvod.name}</h3>
                      <p>{proizvod.shortDescription}</p>
                      <p className="product-price">{proizvod.price} €</p>
                    </Link>

                    <div className="add-to-cart-area">
                      <input
                        type="number"
                        min="1"
                        value={quantities[proizvod.id] || 1}
                        onChange={(e) => handleQuantityChange(proizvod.id, e.target.value)}
                      />
                      <button onClick={() => handleAddToCart(proizvod)} className="add-to-cart-button">+</button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="pagination">
            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>Previous</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ProductListPage;