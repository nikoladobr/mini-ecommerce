import React from 'react';
import { useParams } from 'react-router-dom'; // Za citanje ID iz URLa
import { useQuery } from '@tanstack/react-query'; // Za fetchovanje podataka
import axios from 'axios';

function ProductDetailsPage() {

  // ID proizvoda iz URL parametara /pruducts/:id
  const { id } = useParams();

  // Fetch podataka za proizvod na osnovu ID-a
  const { data, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await axios.get(`https://localhost:7047/api/products/${id}`);
      return res.data;
    },
  });

  // Loading state
  if (isLoading) return <p>Učitavanje detalja...</p>;

  // Error state
  if (isError) return <p>Greška pri učitavanju detalja proizvoda.</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>{data.name}</h1>
      <img src={data.imageUrl} alt={data.name} style={{ width: '300px' }} />
      <p>{data.shortDescription}</p>
      <p><strong>{data.price} €</strong></p>
    </div>
  );
}

export default ProductDetailsPage;
