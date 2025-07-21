import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useCart } from './context/CartContext';
import './ProductDetailsPage.css';

function ProductDetailsPage() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const { addToCart } = useCart();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await axios.get(`https://localhost:7047/api/products/${id}`);
      return res.data;
    },
  });

  const handleAddToCart = () => {
    if (quantity <= 0) {
      alert('Quantity must be more than 0!');
      return;
    }

    setAdding(true);
    addToCart(data, quantity);
    setAdding(false);
    alert('Product added to cart!');
  };

  if (isLoading) return <p>Loading details...</p>;
  if (isError) return <p>Error loading product details</p>;
  if (!data) return <p>Product not found.</p>;
  console.log(data);

  const images = data.images && data.images.length > 0 ? data.images : ['images/placeholder.jpg'];
  const mainImage = selectedImage || `/${images[0]}`;

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Breadcrumb navigacija */}
      <nav style={{ marginBottom: '1rem' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#007bff' }}>
          Products
        </Link>{' '}
        &gt; <span>{data.name}</span>
      </nav>

      <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
        {/* slike na levoj strani */}
        <div style={{ flex: '1' }}>
          <img
            src={mainImage}
            alt={data.name}
            style={{
              width: '100%',
              maxWidth: '400px',
              borderRadius: '10px',
              marginBottom: '10px',
            }}
          />

          {/* galerija */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {images.map((img, index) => (
              <img
                key={index}
                src={`/${img}`}
                alt={`Slika ${index + 1}`}
                style={{
                  width: '70px',
                  height: '70px',
                  border: selectedImage === `/${img}` ? '2px solid #007bff' : '1px solid #ccc',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  objectFit: 'cover',
                }}
                onClick={() => setSelectedImage(`/${img}`)}
              />
            ))}
          </div>
        </div>

        {/* Na desnoj strani cena opis i specifikacije */}
        <div style={{ flex: '2' }}>
          <h1>{data.name}</h1>
          <p><strong>Price:</strong> {data.price} €</p>
          <p><strong>Short description:</strong> {data.shortDescription}</p>
          <p><strong>Full description:</strong> {data.fullDescription || 'Nema detaljnog opisa.'}</p>

          {data.technicalSpecifications && typeof data.technicalSpecifications === 'object' && (
            <>
              <p><strong>Technical specifications</strong></p>
              <ul>
                {Object.entries(data.technicalSpecifications).map(([key, value]) => (
                  <li key={key}><strong>{key}:</strong> {value}</li>
                ))}
              </ul>
            </>
          )}

          {/* dodavanje u korpu */}
          <div style={{ marginTop: '1.5rem' }}>
            <label htmlFor="quantity">Quantity: </label>
            <input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              style={{ width: '60px', marginLeft: '10px', marginRight: '20px' }}
            />
            <button onClick={handleAddToCart} disabled={adding}>
              {adding ? 'Loading' : 'Add to cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsPage;
