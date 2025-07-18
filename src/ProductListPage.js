import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';

function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [viewMode, setViewMode] = useState(searchParams.get('view') || 'grid');
  const [sortOption, setSortOption] = useState(searchParams.get('sort') || '');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [itemsPerPage, setItemsPerPage] = useState(Number(searchParams.get('perPage')) || 5);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce efekat za search input (300ms)
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

  // Sync stanja sa URL-om
  useEffect(() => {
    setSearchParams({
      page: currentPage,
      perPage: itemsPerPage,
      sort: sortOption,
      view: viewMode,
    });
  }, [currentPage, itemsPerPage, sortOption, viewMode, setSearchParams]);

  if (isLoading) return <p>Učitavanje...</p>;
  if (isError) return <p>Greška pri učitavanju proizvoda.</p>;
  if (!data || !Array.isArray(data)) return <p>Greška: Nevalidan format podataka.</p>;

  // Filtriranje po nazivu (debounced)
  const filteredData = data.filter((p) =>
    p.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  // Sortiranje
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

  // Paginacija
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Proizvodi</h1>

      {/* Grid/List toggle */}
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setViewMode('grid')} disabled={viewMode === 'grid'}>
          Grid prikaz
        </button>
        <button onClick={() => setViewMode('list')} disabled={viewMode === 'list'} style={{ marginLeft: '10px' }}>
          List prikaz
        </button>
      </div>

      {/* Sortiranje */}
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="sort">Sortiraj po: </label>
        <select
          id="sort"
          value={sortOption}
          onChange={(e) => {
            setSortOption(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">-- Odaberi --</option>
          <option value="priceAsc">Cena: Rastuće</option>
          <option value="priceDesc">Cena: Opadajuće</option>
          <option value="nameAsc">Naziv: A → Z</option>
          <option value="nameDesc">Naziv: Z → A</option>
        </select>
      </div>

      {/* Stavke po stranici */}
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="perPage">Proizvoda po stranici: </label>
        <select
          id="perPage"
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(parseInt(e.target.value));
            setCurrentPage(1);
          }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
        </select>
      </div>

      {/* Pretraga */}
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="search">Pretraga: </label>
        <input
          id="search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Pretraži po nazivu..."
        />
      </div>

      <p>Pronađeno: {filteredData.length} proizvoda</p>

      {/* Prikaz proizvoda */}
      <div
        style={{
          display: 'flex',
          flexDirection: viewMode === 'grid' ? 'row' : 'column',
          gap: '20px',
          flexWrap: viewMode === 'grid' ? 'wrap' : 'nowrap',
        }}
      >
        {paginatedData.length === 0 ? (
          <p>Nema dostupnih proizvoda.</p>
        ) : (
          paginatedData.map((proizvod) => (
            <Link
              key={proizvod.id}
              to={`/products/${proizvod.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '10px',
                  width: viewMode === 'grid' ? '200px' : '100%',
                  display: 'flex',
                  flexDirection: viewMode === 'grid' ? 'column' : 'row',
                  alignItems: viewMode === 'grid' ? 'center' : 'flex-start',
                  gap: viewMode === 'grid' ? '0' : '20px',
                }}
              >
                <img
                  src={proizvod.imageUrl}
                  alt={proizvod.name}
                  style={{
                    width: viewMode === 'grid' ? '100%' : '150px',
                    height: 'auto',
                    objectFit: 'cover',
                  }}
                />
                <div>
                  <h3>{proizvod.name}</h3>
                  <p>{proizvod.shortDescription}</p>
                  <p><strong>{proizvod.price} €</strong></p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Paginacija */}
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Prethodna
        </button>
        <span>Stranica {currentPage} od {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Sledeća
        </button>
      </div>
    </div>
  );
}

export default ProductListPage;
