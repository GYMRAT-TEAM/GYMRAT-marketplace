import React, { useState, useEffect } from 'react';
import './AdminProducts.css';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [updating, setUpdating] = useState(null);

    const token = localStorage.getItem('gymrat_token');

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const res = await fetch('http://localhost:5001/api/admin/users', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setUsers(data.users || data || []);
                }
            } catch (err) {
                console.error('Error fetching users:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleSuspend = async (id) => {
        if (!window.confirm('Suspend this user?')) return;
        setUpdating(id);
        try {
            const res = await fetch(`http://localhost:5001/api/admin/users/${id}/suspend`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setUsers(prev => prev.map(u => u._id === id ? { ...u, status: 'suspended' } : u));
        } catch (err) { console.error(err); }
        finally { setUpdating(null); }
    };

    const handleApprove = async (id) => {
        setUpdating(id);
        try {
            const res = await fetch(`http://localhost:5001/api/admin/users/${id}/approve`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setUsers(prev => prev.map(u => u._id === id ? { ...u, status: 'active' } : u));
        } catch (err) { console.error(err); }
        finally { setUpdating(null); }
    };

    const filtered = users.filter(u =>
        `${u.firstName || ''} ${u.lastName || ''} ${u.email || ''}`.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="admin-loading">LOADING USERS...</div>;

    return (
        <div className="admin-products">
            <div className="products-header-top">
                <div className="products-actions">
                    <h2 style={{ color: 'white', margin: 0 }}>All Users</h2>
                    <span style={{ color: '#8f96b2', fontSize: 13 }}>{filtered.length} users</span>
                </div>
                <input
                    type="text"
                    className="search-customer"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            <div className="products-table-container">
                {filtered.length === 0 ? (
                    <div className="admin-empty"><p>No users found.</p></div>
                ) : (
                    <table className="products-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Plan</th>
                                <th>Status</th>
                                <th>Joined</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(u => (
                                <tr key={u._id}>
                                    <td>
                                        <span className="p-name">{u.firstName || u.name || 'User'} {u.lastName || ''}</span>
                                    </td>
                                    <td><span className="p-sku">{u.email}</span></td>
                                    <td>
                                        <span style={{ color: u.role === 'super_admin' ? '#e74c3c' : '#8f96b2', textTransform: 'capitalize' }}>
                                            {u.role === 'super_admin' ? 'Super Admin' : u.role || 'user'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="p-sku" style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                                            {u.plan || 'Free'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${u.status === 'active' ? 'approved' : 'draft'}`}>
                                            <span className="dot" /> {u.status || 'active'}
                                        </span>
                                    </td>
                                    <td><span className="p-sku">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</span></td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                            {u.status !== 'active' && u.role !== 'super_admin' && (
                                                <button className="btn-add-product" disabled={updating === u._id}
                                                    onClick={() => handleApprove(u._id)}
                                                    style={{ padding: '4px 12px', fontSize: 12, background: '#27ae60', border: 'none' }}>
                                                    Approve
                                                </button>
                                            )}
                                            {u.status !== 'suspended' && u.role !== 'super_admin' && (
                                                <button className="btn-delete" disabled={updating === u._id}
                                                    onClick={() => handleSuspend(u._id)}>
                                                    Suspend
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}