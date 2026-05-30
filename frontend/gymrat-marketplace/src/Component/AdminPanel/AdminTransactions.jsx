import React, { useState, useEffect } from 'react';
import './AdminProducts.css'; // Reusing similar table styles

export default function AdminTransactions() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('gymrat_token');
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/admin/orders`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          // Backend returns { orders: [], total: ... }
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.error('Error fetching admin orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="admin-loading">LOADING TRANSACTIONS...</div>;

  return (
    <div className="admin-products">
      <div className="products-header-top">
        <div className="products-actions">
          <h2 style={{ color: 'white', margin: 0 }}>Financial Transactions</h2>
        </div>
        <button className="btn-add-product">Export CSV</button>
      </div>

      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Buyer</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? orders.map((order) => (
              <tr key={order._id}>
                <td>
                  <span className="p-sku">#{order._id.slice(-6).toUpperCase()}</span>
                </td>
                <td>
                  <div className="p-name">
                    {order.buyer ? `${order.buyer.firstName} ${order.buyer.lastName}` : 'Guest User'}
                  </div>
                </td>
                <td>
                  <div className="p-sku">
                    {order.items.map(item => item.title).join(', ')}
                  </div>
                </td>
                <td className="center-col" style={{ fontWeight: '600', color: '#ff333d' }}>
                  {order.totalAmount.toLocaleString()} DZA
                </td>
                <td className="center-col">
                  {order.paymentMethod.replace(/_/g, ' ').toUpperCase()}
                </td>
                <td>
                  <span className={`status-badge ${order.status.toLowerCase()}`}>
                    <span className="dot"></span> {order.status}
                  </span>
                </td>
                <td>
                  <div className="p-sku">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No transactions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
