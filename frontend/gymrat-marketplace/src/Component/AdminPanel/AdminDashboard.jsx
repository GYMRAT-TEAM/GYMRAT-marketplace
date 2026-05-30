import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('gymrat_token');
      if (!token) {
        window.location.href = '/signin';
        return;
      }

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/admin/dashboard-stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('gymrat_token');
          window.location.href = '/signin';
          return;
        }

        const data = await response.json();
        setStats(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="admin-loading">LOADING GYMRAT DATA...</div>;
  if (!stats) return <div className="admin-error">ERROR LOADING DASHBOARD</div>;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard Overview</h1>
        <div className="dashboard-actions">
          <button className="btn-filter">Filters</button>
          <button className="btn-share">Share</button>
        </div>
      </div>

      {/* Top Statistic Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-details">
            <span className="stat-title">Gross Sales</span>
            <h2>{stats.grossSales?.toLocaleString() || 0} DZA</h2>
            <p className="stat-trend positive">▲ {(stats.newSalesCount > 0 ? 100 : 0)}% new</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-details">
            <span className="stat-title">Average Sales</span>
            <h2>{stats.avgSales?.toLocaleString() || 0} DZA</h2>
            <p className="stat-trend positive">▲ Stable</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-details">
            <span className="stat-title">New Sales</span>
            <h2>{stats.newSalesCount || 0}</h2>
            <p className="stat-trend positive">▲ today</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-details">
            <span className="stat-title">Gross Profits</span>
            <h2>{stats.grossProfits?.toLocaleString() || 0} DZA</h2>
            <p className="stat-trend positive">▲ 15% rate</p>
          </div>
        </div>
      </div>

      {/* Middle Section: Advanced Charts */}
      <div className="dashboard-middle-row">
        <div className="chart-card">
          <h3>Sales Analysis</h3>
          <div className="mock-chart-container">
            <svg width="100%" height="220" viewBox="0 0 400 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#730c1e" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#730c1e" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Fill Area */}
              <path 
                d="M0 180 C 40 160, 60 190, 100 140 C 140 90, 180 120, 220 80 C 260 40, 300 100, 340 70 C 380 40, 400 60, 400 60 V 200 H 0 Z" 
                fill="url(#chartGradient)"
              />
              {/* Main Line */}
              <path 
                d="M0 180 C 40 160, 60 190, 100 140 C 140 90, 180 120, 220 80 C 260 40, 300 100, 340 70 C 380 40, 400 60, 400 60" 
                stroke="#730c1e" 
                strokeWidth="4" 
                fill="none" 
                strokeLinecap="round"
              />
              {/* Secondary Reference Line */}
              <path 
                d="M0 190 C 50 170, 100 200, 150 160 C 200 120, 250 140, 300 110 C 350 80, 400 90, 400 90" 
                stroke="rgba(31, 142, 205, 0.4)" 
                strokeWidth="2" 
                fill="none" 
                strokeDasharray="5,5"
              />
            </svg>
          </div>
        </div>
        <div className="chart-card align-center">
          <h3>Product Analysis</h3>
          <div className="mock-pie-chart-container">
            <svg width="160" height="160" viewBox="0 0 40 40" className="pie-svg">
              <circle cx="20" cy="20" r="15.9155" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8"></circle>
              <circle cx="20" cy="20" r="15.9155" fill="transparent" stroke="#730c1e" strokeWidth="8" strokeDasharray="45 55" strokeDashoffset="25"></circle>
              <circle cx="20" cy="20" r="15.9155" fill="transparent" stroke="#1f8ecd" strokeWidth="8" strokeDasharray="30 70" strokeDashoffset="80"></circle>
            </svg>
          </div>
          <div className="pie-legend">
            <span>PROTEIN</span>
            <span>EQUIPMENT</span>
            <span>ACCESSORIES</span>
          </div>
        </div>
      </div>

      {/* Operational Section: Lists */}
      <div className="dashboard-data-grid">
        {/* Recent Orders Column */}
        <div className="data-panel left-panel">
          <div className="panel-header">
            <h3>Recent Orders</h3>
          </div>
          <div className="order-list">
            {stats.recentOrders.map(order => (
              <div key={order._id} className="order-item no-icon">
                <div className="order-info">
                  <div className="order-name">{order.product.title}</div>
                  <div className="order-meta">{order.buyer.firstName} · {order._id.slice(-6)}</div>
                </div>
                <div className="order-pricing">
                  <div className="order-price">{order.amount.toLocaleString()} DZA</div>
                  <span className={`status-pill ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* KYC Queue Column */}
        <div className="data-panel right-panel">
          <div className="panel-header">
            <h3>KYC Verification Queue</h3>
          </div>
          <div className="kyc-list">
            {stats.kycQueue.length > 0 ? stats.kycQueue.map(user => (
              <div key={user.id} className="kyc-item">
                <div className="kyc-avatar">
                  {user.name.split(' ').map(n=>n[0]).join('')}
                </div>
                <div className="kyc-info">
                  <div className="kyc-name">{user.name}</div>
                  <div className="kyc-meta">{user.role} · {user.docs}</div>
                </div>
                <span className={`status-pill kyc-${user.status.toLowerCase()}`}>
                  {user.status}
                </span>
              </div>
            )) : <p className="empty-msg">No pending KYC requests</p>}
          </div>
        </div>
      </div>

      {/* Bottom Section: Transactions */}
      <div className="transactions-card">
        <h3>Recent Transactions</h3>
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Product</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {stats.transactions.map((tx, idx) => (
              <tr key={idx}>
                <td>{tx.name}</td>
                <td>{tx.product}</td>
                <td>{tx.date}</td>
                <td>{tx.amount.toLocaleString()} DZA</td>
                <td><span className={`badge ${tx.status.toLowerCase() === 'delivered' ? 'done' : 'delayed'}`}>{tx.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
