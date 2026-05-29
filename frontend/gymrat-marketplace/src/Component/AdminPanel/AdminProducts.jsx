import React, { useState, useEffect, useCallback } from 'react';
import './AdminProducts.css';

const EMPTY_FORM = {
  name: '', brand: '', description: '', price: '', oldPrice: '',
  stock: '', type: 'Supplements', sport: 'Gym', badge: '', img: '', color: '', size: '',
};

const CATEGORIES = ['Supplements', 'Equipment', 'Clothing', 'Accessories', 'Footwear', 'General'];
const SPORTS = ['Gym', 'Football', 'Basketball', 'Swimming', 'Boxing', 'Cycling', 'Tennis', 'Volleyball', 'Pilates', 'General'];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);

  const token = localStorage.getItem('gymrat_token');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5001/api/admin/products', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setProducts(data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) { setError('Product name and price are required.'); return; }
    setSaving(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5001/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
          stock: Number(form.stock) || 0
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setShowModal(false);
        setForm(EMPTY_FORM);
        fetchProducts();
      } else {
        setError(data.message || 'Failed to add product.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await fetch(`http://localhost:5001/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeleting(null);
    }
  };

  const filtered = products.filter(p =>
    (p.name || p.title || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-products">

      <div className="products-header-top">
        <div className="products-actions">
          <input
            type="text"
            className="search-customer"
            placeholder="Search product..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <span style={{ color: '#8f96b2', fontSize: 13 }}>{filtered.length} products</span>
        </div>
        <button className="btn-add-product" onClick={() => { setShowModal(true); setError(''); }}>
          + Add Product
        </button>
      </div>

      <div className="products-table-container">
        {loading ? (
          <div className="admin-loading">LOADING PRODUCTS...</div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">
            <p>No products found.</p>
            <button className="btn-add-product" style={{ marginTop: 16 }} onClick={() => setShowModal(true)}>
              + Add Your First Product
            </button>
          </div>
        ) : (
          <table className="products-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Sport</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((prod) => {
                const displayName = prod.name || prod.title || 'Untitled';
                const displayImg = prod.img || (prod.images && prod.images[0]) || (prod.photos && prod.photos[0]) || '';
                const displayPrice = prod.price !== undefined ? prod.price : 0;
                const displayStock = prod.stock !== undefined ? prod.stock : 0;
                const displayCat = prod.type || prod.category || '—';
                const displaySport = prod.sport || '—';
                const displayStatus = prod.status || 'approved';

                return (
                  <tr key={prod._id}>
                    <td>
                      <div className="product-info-cell">
                        {displayImg ? (
                          <img src={displayImg} alt={displayName} className="product-thumb" onError={e => { e.target.style.display = 'none'; }} />
                        ) : (
                          <div className="product-thumb-placeholder">IMG</div>
                        )}
                        <div className="product-name-block">
                          <span className="p-name">{displayName}</span>
                          <span className="p-sku">ID: {prod._id.slice(-6).toUpperCase()}</span>
                        </div>
                      </div>
                    </td>
                    <td className="center-col">{displayCat}</td>
                    <td className="center-col">{displaySport}</td>
                    <td className="center-col">{displayPrice.toLocaleString()} DZD</td>
                    <td className="center-col">{displayStock}</td>
                    <td>
                      <span className={`status-badge ${displayStatus}`}>
                        <span className="dot" /> {displayStatus}
                      </span>
                    </td>
                    <td className="actions-col">
                      <button
                        className="btn-delete"
                        title="Delete"
                        disabled={deleting === prod._id}
                        onClick={() => handleDelete(prod._id)}
                      >
                        {deleting === prod._id ? '...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Product</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&#x2715;</button>
            </div>

            {error && <div className="modal-error">{error}</div>}

            <form onSubmit={handleSubmit} className="modal-form">

              {form.img && (
                <div className="modal-preview">
                  <img src={form.img} alt="preview" onError={e => { e.target.style.display = 'none'; }} />
                </div>
              )}

              <div className="modal-grid">
                <div className="modal-field">
                  <label>Product Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Whey Protein 2kg" required />
                </div>
                <div className="modal-field">
                  <label>Brand</label>
                  <input name="brand" value={form.brand} onChange={handleChange} placeholder="e.g. Optimum Nutrition" />
                </div>
              </div>

              <div className="modal-field">
                <label>Photo URL</label>
                <input name="img" value={form.img} onChange={handleChange} placeholder="https://example.com/image.jpg" />
              </div>

              <div className="modal-field">
                <label>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Describe this product..." />
              </div>

              <div className="modal-grid">
                <div className="modal-field">
                  <label>Price (DZD) *</label>
                  <input name="price" type="number" min="0" value={form.price} onChange={handleChange} placeholder="3500" required />
                </div>
                <div className="modal-field">
                  <label>Old Price (DZD)</label>
                  <input name="oldPrice" type="number" min="0" value={form.oldPrice} onChange={handleChange} placeholder="4500" />
                </div>
              </div>

              <div className="modal-grid">
                <div className="modal-field">
                  <label>Stock Quantity *</label>
                  <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} placeholder="50" required />
                </div>
                <div className="modal-field">
                  <label>Badge</label>
                  <input name="badge" value={form.badge} onChange={handleChange} placeholder="NEW / HOT / SALE" />
                </div>
              </div>

              <div className="modal-grid">
                <div className="modal-field">
                  <label>Category</label>
                  <select name="type" value={form.type} onChange={handleChange}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="modal-field">
                  <label>Sport</label>
                  <select name="sport" value={form.sport} onChange={handleChange}>
                    {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="modal-grid">
                <div className="modal-field">
                  <label>Color</label>
                  <input name="color" value={form.color} onChange={handleChange} placeholder="e.g. Red" />
                </div>
                <div className="modal-field">
                  <label>Size</label>
                  <input name="size" value={form.size} onChange={handleChange} placeholder="e.g. L / 2kg" />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-submit" disabled={saving}>
                  {saving ? 'Adding...' : 'Add Product'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}