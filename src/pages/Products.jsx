import { useState } from 'react';
import { useCart } from '../context/CartContext';
import './Products.css';

// ── PRODUCTS DATA ─────────────────────────────────────────────
const ALL_PRODUCTS = [
  { id: 1,  brand: 'OPTIMUM NUTRITION', name: 'Gold Standard Whey Protein 5lb',     price: 74,  oldPrice: 89,  badge: 'NEW',   type: 'Supplements', img: 'https://i.pinimg.com/736x/f9/9c/8a/f99c8ac24d6c3aa868478a8c27ca4d2f.jpg' },
  { id: 2,  brand: 'NIKE',              name: 'Air Zoom SuperRep 3 Training Shoes',  price: 110, oldPrice: null, badge: null,   type: 'Shoes',       img: 'https://i.pinimg.com/1200x/aa/40/ea/aa40ea281fdbc0816e6b53118c3c6d79.jpg' },
  { id: 3,  brand: 'C4 SPORT',          name: 'C4 Original Pre-Workout Powder',      price: 39,  oldPrice: 49,  badge: 'HOT',   type: 'Supplements', img: 'https://i.pinimg.com/736x/10/2f/47/102f47bdf764c12902d83247df614106.jpg' },
  { id: 4,  brand: 'ADIDAS',            name: 'Essentials Training Hoodie',          price: 65,  oldPrice: null, badge: null,   type: 'Clothing',    img: 'https://i.pinimg.com/736x/3b/5c/69/3b5c691ce31116868ca97a369367c9ce.jpg' },
  { id: 5,  brand: 'FIT-SIMPLIFY',      name: 'Resistance Loop Bands Set (5 Pack)',  price: 18,  oldPrice: 25,  badge: null,    type: 'Equipment',   img: 'https://i.pinimg.com/1200x/4f/82/39/4f82392a86be8e6172ea3de91423f4ed.jpg' },
  { id: 6,  brand: 'MYPROTEIN',         name: 'Creatine Monohydrate 500g',           price: 22,  oldPrice: 28,  badge: '-20%',  type: 'Supplements', img: 'https://i.pinimg.com/736x/27/ce/47/27ce4740cdf3c21c7437c18263298a97.jpg' },
  { id: 7,  brand: 'NIKE',              name: 'Pro Compression Tights',              price: 55,  oldPrice: null, badge: null,   type: 'Clothing',    img: 'https://i.pinimg.com/736x/f9/9c/8a/f99c8ac24d6c3aa868478a8c27ca4d2f.jpg' },
  { id: 8,  brand: 'OPTIMUM NUTRITION', name: 'Micronized Creatine Powder',          price: 28,  oldPrice: 35,  badge: 'SALE',  type: 'Supplements', img: 'https://i.pinimg.com/1200x/4f/82/39/4f82392a86be8e6172ea3de91423f4ed.jpg' },
  { id: 9,  brand: 'ADIDAS',            name: 'Ultraboost 22 Running Shoes',         price: 180, oldPrice: 210, badge: null,    type: 'Shoes',       img: 'https://i.pinimg.com/736x/3b/5c/69/3b5c691ce31116868ca97a369367c9ce.jpg' },
  { id: 10, brand: 'UNDER ARMOUR',      name: 'HeatGear Compression Shirt',          price: 34,  oldPrice: 45,  badge: null,    type: 'Clothing',    img: 'https://i.pinimg.com/736x/3b/5c/69/3b5c691ce31116868ca97a369367c9ce.jpg' },
  { id: 11, brand: 'ROGUE',             name: 'Ohio Deadlift Bar 20kg',              price: 295, oldPrice: null, badge: 'PRO',  type: 'Equipment',   img: 'https://i.pinimg.com/1200x/aa/40/ea/aa40ea281fdbc0816e6b53118c3c6d79.jpg' },
  { id: 12, brand: 'MYPROTEIN',         name: 'Impact Whey Isolate 2.5kg',           price: 58,  oldPrice: 72,  badge: null,    type: 'Supplements', img: 'https://i.pinimg.com/736x/f9/9c/8a/f99c8ac24d6c3aa868478a8c27ca4d2f.jpg' },
];

const TYPES  = [
  { label: 'Supplements', count: 58 },
  { label: 'Clothing',    count: 47 },
  { label: 'Shoes',       count: 32 },
  { label: 'Equipment',   count: 25 },
  { label: 'Accessories', count: 19 },
];
const BRANDS = [
  { label: 'Nike',      count: 43 },
  { label: 'Adidas',    count: 38 },
  { label: 'Optimum',   count: 22 },
  { label: 'MyProtein', count: 31 },
];
const COLORS = ['#4a4a4a', '#ffffff', '#c0392b', '#2980b9', '#27ae60', '#f39c12'];
const SIZES  = [
  { label: 'XS', count: 12 },
  { label: 'S',  count: 28 },
  { label: 'M',  count: 41 },
  { label: 'L',  count: 39 },
  { label: 'XL', count: 22 },
];

// ── HELPERS ───────────────────────────────────────────────────
function toggleSet(arr, val) {
  return arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];
}

// ── PRODUCT CARD ──────────────────────────────────────────────
function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [wished, setWished] = useState(false);
  const [added,  setAdded]  = useState(false);

  const handleAdd = () => {
    addToCart({ ...product, qty: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div className="pc-card">
      <div className="pc-img-wrap">
        {product.badge && <span className="pc-badge">{product.badge}</span>}
        <button
          className={`pc-wish${wished ? ' on' : ''}`}
          onClick={() => setWished(w => !w)}
          aria-label="Wishlist"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill={wished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
        <img src={product.img} alt={product.name} className="pc-img" />
        <div className="pc-img-overlay" />
      </div>

      <div className="pc-body">
        <div className="pc-brand">{product.brand}</div>
        <div className="pc-name">{product.name}</div>
        <div className="pc-footer">
          <div className="pc-pricing">
            <span className="pc-price">DZA {product.price}</span>
            {product.oldPrice && <span className="pc-old">DZA {product.oldPrice}</span>}
          </div>
          <button className={`pc-add${added ? ' added' : ''}`} onClick={handleAdd} aria-label="Add to cart">
            {added
              ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
              : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

// ── CHECKBOX ROW ──────────────────────────────────────────────
function CheckRow({ label, count, checked, onChange }) {
  return (
    <label className="sb-check">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="sb-box" />
      <span className="sb-label">{label}</span>
      <span className="sb-count">{count}</span>
    </label>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────
export default function Products() {
  // filter state
  const [inStock,   setInStock]   = useState(true);
  const [outStock,  setOutStock]  = useState(false);
  const [priceMax,  setPriceMax]  = useState(300);
  const [selTypes,  setSelTypes]  = useState(['Supplements', 'Clothing']);
  const [selBrands, setSelBrands] = useState(['Nike']);
  const [selColor,  setSelColor]  = useState(null);
  const [selSizes,  setSelSizes]  = useState(['M']);
  const [sideOpen,  setSideOpen]  = useState(false);

  const filtered = ALL_PRODUCTS.filter(p => p.price <= priceMax);
  const pct = Math.round((priceMax / 300) * 100);

  return (
    <section id="products" className="mp-wrap">

      {/* ── HEADER ── */}
      <div className="mp-top">
        <div>
          <div className="mp-eyebrow">Marketplace</div>
          <h2 className="mp-heading"><span>ALL</span> <em>PRODUCTS</em></h2>
        </div>
        <div className="mp-top-right">
          <span className="mp-result-count">{filtered.length} products</span>
          <button className="mp-filter-toggle" onClick={() => setSideOpen(o => !o)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/>
            </svg>
            Filters
          </button>
        </div>
      </div>

      {/* ── LAYOUT ── */}
      <div className={`mp-body${sideOpen ? ' sidebar-open' : ''}`}>

        {/* SIDEBAR */}
        <aside className="mp-sidebar">

          <div className="sb-group">
            <div className="sb-title">AVAILABILITY</div>
            <CheckRow label="In Stock"     count={142} checked={inStock}  onChange={e => setInStock(e.target.checked)} />
            <CheckRow label="Out of Stock" count={8}   checked={outStock} onChange={e => setOutStock(e.target.checked)} />
          </div>

          <div className="sb-group">
            <div className="sb-title">PRICE RANGE</div>
            <div className="sb-range-wrap">
              <input
                type="range" min={0} max={300} value={priceMax}
                style={{ '--pct': pct + '%' }}
                onChange={e => setPriceMax(Number(e.target.value))}
                className="sb-range"
              />
            </div>
            <div className="sb-range-labels"><span>DZA 0</span><span>DZA {priceMax}</span></div>
          </div>

          <div className="sb-group">
            <div className="sb-title">PRODUCT TYPE</div>
            {TYPES.map(t => (
              <CheckRow
                key={t.label} label={t.label} count={t.count}
                checked={selTypes.includes(t.label)}
                onChange={() => setSelTypes(toggleSet(selTypes, t.label))}
              />
            ))}
          </div>

          <div className="sb-group">
            <div className="sb-title">BRAND</div>
            {BRANDS.map(b => (
              <CheckRow
                key={b.label} label={b.label} count={b.count}
                checked={selBrands.includes(b.label)}
                onChange={() => setSelBrands(toggleSet(selBrands, b.label))}
              />
            ))}
          </div>

          <div className="sb-group">
            <div className="sb-title">COLOR</div>
            <div className="sb-colors">
              {COLORS.map(c => (
                <button
                  key={c}
                  className={`sb-dot${selColor === c ? ' active' : ''}`}
                  style={{ background: c }}
                  onClick={() => setSelColor(selColor === c ? null : c)}
                />
              ))}
            </div>
          </div>

          <div className="sb-group">
            <div className="sb-title">SIZE</div>
            {SIZES.map(s => (
              <CheckRow
                key={s.label} label={s.label} count={s.count}
                checked={selSizes.includes(s.label)}
                onChange={() => setSelSizes(toggleSet(selSizes, s.label))}
              />
            ))}
          </div>

        </aside>

        {/* PRODUCT GRID */}
        <div className="mp-grid">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>

      </div>
    </section>
  );
}