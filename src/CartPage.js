import React from 'react';
import { useCart } from './context/CartContext';

function CartPage() {
  // funkcije i podaci iz cart contexta
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

  // funkcija za promenu kolicine proizvoda u korpi
  const handleQuantityChange = (id, value) => {
    const quantity = Math.max(1, parseInt(value) || 1);
    updateQuantity(id, quantity);
  };

  // izracunavanje ukupne cene svih proizvoda u korpi
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // ako je korpa prazna prikazi poruku
  if (cart.length === 0) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>Cart is empty</h2>
      </div>
    );
  }

  // glavni prikaz korpe
  return (
    <div style={{ padding: '20px' }}>
      <h2>My cart</h2>

      {/* prikaz svakog proizvoda u korpi */}
      {cart.map((item) => (
        <div
          key={item.id}
          style={{
            borderBottom: '1px solid #ccc',
            padding: '10px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >

          {/* naziv i cena */}
          <div style={{ flex: 2 }}>
            <h4>{item.name}</h4>
            <p>Price: {item.price} €</p>
          </div>

          {/* polje za promenu kolicine */}
          <div style={{ flex: 1 }}>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => handleQuantityChange(item.id, e.target.value)}
              style={{ width: '60px' }}
            />
          </div>


           {/* prikaz ukupne cene za taj proizvod */}
          <div style={{ flex: 1 }}>
            <p>Total: {(item.price * item.quantity).toFixed(2)} €</p>
          </div>
          
          {/* dugme za uklanjanje proizvoda iz korpe */}
          <div>
            <button onClick={() => removeFromCart(item.id)}>Remove</button>
          </div>
        </div>
      ))}

      <hr />

      {/* donji deo korpe sa ukupnom cenom i dugmicima */}
      <div style={{ marginTop: '20px' }}>
        <h3>Total price: {totalPrice.toFixed(2)} €</h3>


         {/* dugme za praznjenje korpe */}
        <button
          onClick={clearCart}
          style={{
            marginTop: '10px',
            marginRight: '10px',
            padding: '10px',
            backgroundColor: '#aaa',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          Empty cart
        </button>
        
        {/* dugme za porucivanje koje cisti korpu i prikazuje alert */}
        <button
          onClick={() => {
            alert('Order sent successfully');
            clearCart();
          }}
          style={{
            marginTop: '10px',
            padding: '10px',
            backgroundColor: 'green',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          Order
        </button>
      </div>
    </div>
  );
}

export default CartPage;
