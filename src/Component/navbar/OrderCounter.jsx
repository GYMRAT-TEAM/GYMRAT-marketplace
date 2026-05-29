// src/Component/Common/OrderCounter.jsx
// =============================================
// ORDER COUNTER - shows total orders in navbar
// Usage: <OrderCounter /> inside your Navbar
// =============================================
import React from 'react';
import { useAuth } from '../../context/AuthContext';

const OrderCounter = () => {
  const { orderCount, isAuthenticated } = useAuth();
  if (!isAuthenticated) return null;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '14px',
      color: 'var(--text-secondary, #666)',
    }}>
      <span>📦</span>
      <span>Orders: <strong>{orderCount}</strong></span>
    </div>
  );
};

export default OrderCounter;