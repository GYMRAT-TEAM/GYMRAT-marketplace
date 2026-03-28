import { useState } from 'react';
import { useCart } from '../context/CartContext';
import './Products.css';

const products = [
  { id: 'prod1', img: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&q=80', brand: 'Optimum Nutrition', name: 'Gold Standard Whey Protein 5lb', price: 74, oldPrice: 89, badge: 'NEW' },
  { id: 'prod2', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80', brand: 'Nike', name: 'Air Zoom SuperRep 3 Training Shoes', price: 110, oldPrice: null, badge: null },
  { id: 'prod3', img: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80', brand: 'C4 Sport', name: 'C4 Original Pre-Workout Powder', price: 39, oldPrice: 49, badge: 'HOT' },
  { id: 'prod4', img: 'https://images.unsplash.com/photo-1519505907962-0a6cb0167c73?w=400&q=80', brand: 'Adidas', name: 'Essentials Training Hoodie', price: 65, oldPrice: null, badge: null },
  { id: 'prod5', img: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400&q=80', brand: 'Fit Simplify', name: 'Resistance Loop Bands Set (5 Pack)', price: 18, oldPrice: 25, badge: null },
  { id: 'prod6', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', brand: 'MyProtein', name: 'Creatine Monohydrate 500g', price: 22, oldPrice: 28, badge: '-20%' },
];

export default function Products() {
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState({});
  const [added, setAdded] = useState({});

  const toggleWish = (id) => setWishlist(prev => ({ ...prev, [id]: !prev[id] }));

  const handleAdd = (id) => {
    addToCart();
    setAdded(prev => ({ ...prev, [id]: true }));
    setTimeout(() => setAdded(prev => ({ ...prev, [id]: false })), 1200);
  };

  return (
    <section id="products">
      <div className="section-label">Marketplace</div>
      <h2 className="section-title">ALL <em>PRODUCTS</em></h2>

      <div className="shop-layout">
        <aside className="sidebar">
          <div className="filter-group">
            <div className="filter-title">Availability</div>
            <div className="filter-option"><input type="checkbox" defaultChecked /><label>In Stock</label><span>142</span></div>
            <div className="filter-option"><input type="checkbox" /><label>Out of Stock</label><span>8</span></div>
          </div>
          <div className="filter-group">
            <div className="filter-title">Price Range</div>
            <input type="range" className="price-range" min="0" max="500" defaultValue="300" />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--muted)', marginTop: '6px' }}>
              <span>$0</span><span>$300</span>
            </div>
          </div>
          <div className="filter-group">
            <div className="filter-title">Product Type</div>
            <div className="filter-option"><input type="checkbox" defaultChecked /><label>Supplements</label><span>58</span></div>
            <div className="filter-option"><input type="checkbox" defaultChecked /><label>Clothing</label><span>47</span></div>
            <div className="filter-option"><input type="checkbox" /><label>Shoes</label><span>32</span></div>
            <div className="filter-option"><input type="checkbox" /><label>Equipment</label><span>25</span></div>
            <div className="filter-option"><input type="checkbox" /><label>Accessories</label><span>19</span></div>
          </div>
          <div className="filter-group">
            <div className="filter-title">Brand</div>
            <div className="filter-option"><input type="checkbox" defaultChecked /><label>Nike</label><span>43</span></div>
            <div className="filter-option"><input type="checkbox" /><label>Adidas</label><span>38</span></div>
            <div className="filter-option"><input type="checkbox" /><label>Optimum</label><span>22</span></div>
            <div className="filter-option"><input type="checkbox" /><label>MyProtein</label><span>31</span></div>
          </div>
          <div className="filter-group">
            <div className="filter-title">Color</div>
            <div className="colors">
              <div className="color-dot active" style={{ background: '#111', border: '2px solid #555' }}></div>
              <div className="color-dot" style={{ background: '#ffffff', border: '1px solid #333' }}></div>
              <div className="color-dot" style={{ background: '#e8293a' }}></div>
              <div className="color-dot" style={{ background: '#2563eb' }}></div>
              <div className="color-dot" style={{ background: '#10b981' }}></div>
              <div className="color-dot" style={{ background: '#f59e0b' }}></div>
            </div>
          </div>
        </aside>

        <div className="products-grid">
          {products.map(p => (
            <div className="product-card" key={p.id}>
              <div className="product-img-wrap">
                <img src={p.img} alt={p.name} className="product-img" />
                {p.badge && <div className="product-badge">{p.badge}</div>}
                <div
                  className="product-wish"
                  onClick={() => toggleWish(p.id)}
                  style={{ color: wishlist[p.id] ? 'var(--red)' : '' }}
                >
                  {wishlist[p.id] ? '♥' : '♡'}
                </div>
              </div>
              <div className="product-info">
                <div className="product-brand">{p.brand}</div>
                <div className="product-name">{p.name}</div>
                <div className="product-price-row">
                  <span>
                    <span className="product-price">${p.price}</span>
                    {p.oldPrice && <span className="product-old">${p.oldPrice}</span>}
                  </span>
                  <button
                    className="btn-add"
                    onClick={() => handleAdd(p.id)}
                    style={{ background: added[p.id] ? '#10b981' : '' }}
                  >
                    {added[p.id] ? '✓' : '+'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}