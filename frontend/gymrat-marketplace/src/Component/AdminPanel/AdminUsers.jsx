import React, { useState, useEffect } from 'react';
import './AdminProducts.css'; // Reusing similar table and dashboard layout styles

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState(null);

  const token = localStorage.getItem('gymrat_token');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || data || []);
      }
    } catch (err) {
      console.error('Error fetching admin users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (id) => {
    setUpdating(id);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/admin/users/${id}/approve`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => u._id === id ? { ...u, status: 'active' } : u));
      }
    } catch (err) {
      console.error('Approve error:', err);
    } finally {
      setUpdating(null);
    }
  };

  const handleSuspend = async (id) => {
    if (!window.confirm('Are you sure you want to suspend this user? they will be blocked from logging in.')) return;
    setUpdating(id);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/admin/users/${id}/suspend`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => u._id === id ? { ...u, status: 'suspended' } : u));
      }
    } catch (err) {
      console.error('Suspend error:', err);
    } finally {
      setUpdating(null);
    }
  };

  const filtered = users.filter(u =>
    `${u.firstName || ''} ${u.lastName || ''} ${u.email || ''}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="admin-loading">LOADING USERS DIRECTORY...</div>;

  return (
    <div className="admin-products">
      <div className="products-header-top">
        <div className="products-actions">
          <h2 style={{ color: 'white', margin: 0 }}>User Directory</h2>
        </div>
        <div className="products-search-wrap" style={{ display: 'flex', gap: '15px' }}>
          <input 
            type="text" 
            placeholder="Search users by name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(0, 0, 0, 0.2)',
              color: 'white',
              width: '280px'
            }}
          />
        </div>
      </div>

      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Membership Plan</th>
              <th>Status</th>
              <th>Joined Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? filtered.map((u) => (
              <tr key={u._id}>
                <td>
                  <div className="p-name" style={{ fontWeight: '600' }}>
                    {u.firstName || 'Gym'} {u.lastName || 'Rat'}
                  </div>
                </td>
                <td>
                  <span className="p-sku">{u.email}</span>
                </td>
                <td>
                  <span style={{ textTransform: 'capitalize', color: u.role === 'super_admin' ? '#ff333d' : '#888' }}>
                    {u.role === 'super_admin' ? 'Super Admin' : u.role}
                  </span>
                </td>
                <td>
                  <span className="p-sku" style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                    {u.plan || 'Standard'}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${u.status === 'active' ? 'active' : u.status === 'suspended' ? 'draft' : 'out'}`}>
                    <span className="dot"></span> {u.status || 'active'}
                  </span>
                </td>
                <td>
                  <span className="p-sku">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    {u.status !== 'active' && u.role !== 'super_admin' && (
                      <button 
                        className="btn-add-product" 
                        onClick={() => handleApprove(u._id)}
                        disabled={updating === u._id}
                        style={{ padding: '4px 10px', fontSize: '12px', background: '#27ae60', border: 'none' }}
                      >
                        Approve
                      </button>
                    )}
                    {u.status !== 'suspended' && u.role !== 'super_admin' && (
                      <button 
                        className="btn-add-product" 
                        onClick={() => handleSuspend(u._id)}
                        disabled={updating === u._id}
                        style={{ padding: '4px 10px', fontSize: '12px', background: '#c0392b', border: 'none' }}
                      >
                        Suspend
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No users found in database.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
