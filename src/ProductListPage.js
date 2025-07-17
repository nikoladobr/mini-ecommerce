import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ProductListPage() {
   
  // Lista proizvoda sa backend API-ja  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await axios.get('https://localhost:7047/api/products'); // prilagodi port ako je drugačiji
      return res.data;
    },
  });

  // Prikaz loading stanja dok se podaci učitavaju
  if (isLoading) return <p>Učitavanje...</p>;

  // Greska ako dodje do problema u fetchovanju
  if (isError) return <p>Greška pri učitavanju proizvoda.</p>;

  // Provera da li je dobijen validan niz podataka
  if (!data || !Array.isArray(data)) {
    return <p>Greška: Nevalidan format podataka.</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Proizvodi</h1>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {data.map((proizvod) => (
          <Link
            key={proizvod.id}
            to={`/products/${proizvod.id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '10px',
              width: '200px'
            }}>
              <img src={proizvod.imageUrl} alt={proizvod.name} style={{ width: '100%' }} />
              <h3>{proizvod.name}</h3>
              <p>{proizvod.shortDescription}</p>
              <p><strong>{proizvod.price} €</strong></p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ProductListPage;
