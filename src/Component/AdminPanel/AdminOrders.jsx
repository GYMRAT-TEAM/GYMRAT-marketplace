import React, { useState, useEffect } from 'react';
import './AdminProducts.css';

const STATUS_COLORS = {
    pending: 'draft',
    processing: 'draft',
    shipped: 'approved',
    delivered: 'approved',
    cancelled: 'out',
    refunded: 'out',
};

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    const token = localStorage.getItem('gymrat_token');

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const res = await fetch('http://localhost:5001/api/admin/orders', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data.orders || data || []);
                }
            } catch (err) {
                console.error('Error fetching orders:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const filtered = orders.filter(o => {
        const matchSearch =
            (o._id || '').toLowerCase().includes(search.toLowerCase()) ||
            (o.user?.email || o.email || '').toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === 'all' || (o.status || 'pending') === filter;
        return matchSearch && matchFilter;
    });

    if (loading) return <div className="admin-loading">LOADING ORDERS...</div>;

    return (
        <div className="admin-products">
            <div className="products-header-top">
                <div className="products-actions">
                    <h2 style={{ color: 'white', margin: 0 }}>All Orders</h2>
                    <span style={{ color: '#8f96b2', fontSize: 13 }}>{filtered.length} orders</span>
                </div>
                <input
                    type="text"
                    className="search-customer"
                    placeholder="Search by order ID or email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {/* Status filter */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                    <button key={s} onClick={() => setFilter(s)} style={{
                        padding: '5px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
                        fontSize: 12, fontWeight: 600, textTransform: 'capitalize',
                        background: filter === s ? '#c0392b' : '#1a1f2e',
                        color: filter === s ? '#fff' : '#8f96b2'
                    }}>{s}</button>
                ))}
            </div>

            <div className="products-table-container">
                {filtered.length === 0 ? (
                    <div className="admin-empty"><p>No orders found.</p></div>
                ) : (
                    <table className="products-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((o, i) => {
                                const orderId = o._id ? '#' + o._id.slice(-6).toUpperCase() : `#ORD${i + 1}`;
                                const customer = o.user?.email || o.user?.name || o.email || '—';
                                const items = o.items?.length || o.products?.length || o.orderItems?.length || '—';
                                const total = o.total || o.totalAmount || o.totalPrice || 0;
                                const date = o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '—';
                                const status = (o.status || 'pending').toLowerCase();

                                return (
                                    <tr key={o._id || i}>
                                        <td><span className="p-name" style={{ fontFamily: 'monospace' }}>{orderId}</span></td>
                                        <td><span className="p-sku">{customer}</span></td>
                                        <td className="center-col">{items}</td>
                                        <td className="center-col">{typeof total === 'number' ? total.toLocaleString() + ' DZD' : total}</td>
                                        <td><span className="p-sku">{date}</span></td>
                                        <td>
                                            <span className={`status-badge ${STATUS_COLORS[status] || 'draft'}`}>
                                                <span className="dot" /> {status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}