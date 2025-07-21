import React from 'react';
import { NavLink } from 'react-router-dom';
import { useCart } from './context/CartContext';

function Header() {
  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header style={styles.header}>
      <nav style={styles.nav}>
        <NavLink
          to="/products"
          style={({ isActive }) => ({
            ...styles.link,
            fontWeight: isActive ? 'bold' : 'normal',
            color: isActive ? '#000' : '#333',
          })}
        >
          Products
        </NavLink>
        <NavLink to="/cart" style={styles.cartLink}>
          🛒 Cart ({totalItems})
        </NavLink>
      </nav>
    </header>
  );
}

const styles = {
  header: {
    padding: '10px 20px',
    backgroundColor: '#f8f8f8',
    borderBottom: '1px solid #ccc',
    marginBottom: '20px',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  link: {
    textDecoration: 'none',
    color: '#333',
    fontSize: '18px',
  },
  cartLink: {
    textDecoration: 'none',
    fontSize: '18px',
    backgroundColor: '#e0e0e0',
    padding: '5px 10px',
    borderRadius: '5px',
    color: '#000',
  },
};

export default Header;
