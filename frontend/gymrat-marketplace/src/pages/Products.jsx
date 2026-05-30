import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductDetailModal from '../Component/Common/ProductDetailModal';
import './Products.css';

// ── PRODUCT DATABASE (25 ITEMS) ─────────────────────────────────────────────
const ALL_PRODUCTS = [
  // SUPPLEMENTS
  { id:1, brand:'OPTIMUM NUTRITION', name:'Gold Standard Whey Protein 5lb', price:14800, oldPrice:16500, badge:'NEW', type:'Supplements', sport:'Gym', color:'#4a4a4a', size:'M', inStock:true, img:'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=500', description:'The world\'s best-selling whey protein powder. 24g of protein per serving, with only 1g of sugar and 3g of creatine. Perfect for post-workout recovery and muscle building.', specs:[{key:'Protein per serving',value:'24g'},{key:'Weight',value:'2.27kg'},{key:'Servings',value:'74'},{key:'Flavour',value:'Double Rich Chocolate'}] },
  { id:2, brand:'MYPROTEIN', name:'Impact Whey Isolate 1kg', price:8900, oldPrice:null, badge:null, type:'Supplements', sport:'Gym', color:'#ffffff', size:'L', inStock:true, img:'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=500', description:'Ultra-pure whey isolate with 90%+ protein content. Low in fat and carbs, perfect for lean muscle gain and cutting phases.', specs:[{key:'Protein per serving',value:'22g'},{key:'Weight',value:'1kg'},{key:'Servings',value:'40'}] },
  { id:3, brand:'C4 SPORT', name:'C4 Original Explosive Pre-Workout', price:6800, oldPrice:7500, badge:'HOT', type:'Supplements', sport:'Gym', color:'#f39c12', size:'S', inStock:true, img:'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=500', description:'America\'s #1 selling pre-workout powder. Explosive energy, creatine nitrate for pumps and beta-alanine for endurance. Take 30 minutes before training.', specs:[{key:'Caffeine',value:'150mg'},{key:'Creatine Nitrate',value:'1g'},{key:'Beta-Alanine',value:'1.6g'}] },
  { id:4, brand:'DYMATIZE', name:'ISO100 Hydrolyzed Gourmet Vanilla 2.2kg', price:18500, oldPrice:19500, badge:'PRO', type:'Supplements', sport:'Gym', color:'#2980b9', size:'XL', inStock:true, img:'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=500', description:'Hydrolyzed 100% whey protein isolate — the fastest absorbing protein available. Ideal for elite athletes who demand the best recovery.', specs:[{key:'Protein per serving',value:'25g'},{key:'Hydrolyzed',value:'Yes'},{key:'Gluten Free',value:'Yes'}] },
  { id:5, brand:'BIOTECHUSA', name:'Iso Whey Zero Cross-Flow 908g', price:9200, oldPrice:10500, badge:'-10%', type:'Supplements', sport:'Gym', color:'#ffffff', size:'M', inStock:false, img:'https://images.unsplash.com/photo-1612532275555-f2d42e3aeb5e?q=80&w=500', description:'Zero sugar, zero fat, zero compromise. Cross-flow micro-filtered whey isolate for pure, clean protein in every scoop.', specs:[{key:'Protein per serving',value:'23g'},{key:'Sugar',value:'0g'},{key:'Fat',value:'0.5g'}] },

  // ==================== CLOTHING (5 Items) ====================
  { 
    id: 6, brand: 'ADIDAS', name: 'Essentials 3-Stripes Training Hoodie',          
    price: 9500, oldPrice: null, badge: null, type: 'Clothing',    
    color: '#c0392b', size: 'M', inStock: true,  
    img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=500' 
  },
  { 
    id: 7, brand: 'NIKE', name: 'Pro Dri-FIT Full Compression Tights',              
    price: 7800, oldPrice: null, badge: null, type: 'Clothing',    
    color: '#4a4a4a', size: 'L', inStock: true,  
    img: 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=500' 
  },
  { 
    id: 8, brand: 'UNDER ARMOUR', name: 'HeatGear High-Ventilation Compression Shirt',          
    price: 6500, oldPrice: 8000, badge: null, type: 'Clothing',    
    color: '#4a4a4a', size: 'M', inStock: true,  
    img: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=500' 
  },
  { 
    id: 9, brand: 'PUMA', name: 'Active Training Gym Performance Tee',
    price: 4800, oldPrice: 5500, badge: 'SALE', type: 'Clothing',    
    color: '#2980b9', size: 'S', inStock: true,
    img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=500'
  },
  { 
    id: 10, brand: 'GYMSHARK', name: 'Crest Drop Armhole Bodybuilding Tank',
    price: 5200, oldPrice: 6000, badge: 'HOT', type: 'Clothing', 
    color: '#4a4a4a', size: 'L', inStock: true,
    img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=500'
  },

  // ==================== SHOES (5 Items) ====================
  { 
    id: 11, brand: 'NIKE', name: 'Air Zoom SuperRep 3 Athletic Shoes',  
    price: 22500, oldPrice: null, badge: null, type: 'Shoes',       
    color: '#ffffff', size: 'L', inStock: true,  
    img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=500' 
  },
  { 
    id: 12, brand: 'ADIDAS', name: 'Ultraboost 22 Infinite Running Shoes',         
    price: 29000, oldPrice: 34000, badge: null, type: 'Shoes',       
    color: '#2980b9', size: 'XL', inStock: true,  
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500' 
  },
  { 
    id: 13, brand: 'PUMA', name: 'Fuse 2.0 Heavy Lifting Cross-Trainers',
    price: 16800, oldPrice: 19000, badge: 'SALE', type: 'Shoes',       
    color: '#4a4a4a', size: 'M', inStock: true,
    img: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=500'
  },
  { 
    id: 14, brand: 'UNDER ARMOUR', name: 'Project Rock 5 BSR Edition Shoes',
    price: 24500, oldPrice: null, badge: 'HOT', type: 'Shoes',       
    color: '#f39c12', size: 'L', inStock: true,
    img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=500'
  },
  { 
    id: 15, brand: 'REEBOK', name: 'Nano X3 Versatile CrossFit Shoes',
    price: 21000, oldPrice: 23500, badge: 'NEW', type: 'Shoes', 
    color: '#ffffff', size: 'M', inStock: true,
    img: 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=500'
  },

  // ==================== EQUIPMENT (5 Items) ====================
  { 
    id: 16, brand: 'DOMYOS', name: 'Resistance Loop Bands Set (5 Pack)',  
    price: 2800, oldPrice: 3500, badge: null, type: 'Equipment',   
    color: '#27ae60', size: 'XS', inStock: true,  
    img: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?q=80&w=500' 
  },
  { 
    id: 17, brand: 'PROFORM', name: 'Heavy Duty Chrome Olympic Barbell 20kg',     
    price: 38000, oldPrice: null, badge: 'PRO', type: 'Equipment',   
    color: '#4a4a4a', size: 'XL', inStock: true,  
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=500' 
  },
  { 
    id: 18, brand: 'ROGUE', name: 'Cast Iron Dumbbells Hex Core 15kg Pair',
    price: 16500, oldPrice: 18000, badge: null, type: 'Equipment',   
    color: '#4a4a4a', size: 'M', inStock: true,
    img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=500'
  },
  { 
    id: 19, brand: 'DOMYOS', name: 'Adjustable Heavy Incline Workout Bench',
    price: 19500, oldPrice: 22000, badge: null, type: 'Equipment',   
    color: '#4a4a4a', size: 'L', inStock: false,
    img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=500'
  },
  { 
    id: 20, brand: 'ROGUE', name: 'Competition Rubber Bumper Plates 20kg Pair',
    price: 26000, oldPrice: null, badge: 'NEW', type: 'Equipment', 
    color: '#c0392b', size: 'XL', inStock: true,
    img: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=500'
  },

  // ==================== ACCESSORIES (5 Items) ====================
  { 
    id: 21, brand: 'NIKE', name: 'Speed Pro Bearing-Loaded Jump Rope',
    price: 3200, oldPrice: null, badge: null, type: 'Accessories', 
    color: '#c0392b', size: 'S', inStock: true,
    img: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?q=80&w=500'
  },
  { 
    id: 22, brand: 'UNDER ARMOUR', name: 'Undeniable 5.0 Waterproof Duffle Bag',
    price: 9800, oldPrice: 11000, badge: 'NEW', type: 'Accessories', 
    color: '#4a4a4a', size: 'L', inStock: true,
    img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=500'
  },
  { 
    id: 23, brand: 'DOMYOS', name: 'Neoprene Heavy Duty Lifting Wrist Wraps',
    price: 2400, oldPrice: 3000, badge: null, type: 'Accessories', 
    color: '#4a4a4a', size: 'XS', inStock: true,
    img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=500'
  },
  { 
    id: 24, brand: 'PUMA', name: 'Stainless Steel Insulated Blender Shaker 750ml',
    price: 4200, oldPrice: null, badge: null, type: 'Accessories', 
    color: '#ffffff', size: 'M', inStock: true,
    img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=500'
  },
  { 
    id: 25, brand: 'ROGUE', name: 'Reinforced 4-Inch Leather Weightlifting Belt',
    price: 13500, oldPrice: 15000, badge: 'HOT', type: 'Accessories', 
    color: '#4a4a4a', size: 'XL', inStock: true,
    img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=500'
  }
];

// ── CONSTANTS ──────────────────────────────────────────────────────
const TYPES = [
  { label: 'Supplements', count: 5 },
  { label: 'Clothing',    count: 5 },
  { label: 'Shoes',       count: 5 },
  { label: 'Equipment',   count: 5 },
  { label: 'Accessories', count: 5 },
];

const BRANDS = [
  { label: 'Nike',              count: 3 },
  { label: 'Adidas',            count: 2 },
  { label: 'Optimum Nutrition', count: 1 },
  { label: 'MyProtein',         count: 1 },
  { label: 'Under Armour',      count: 3 },
  { label: 'Puma',              count: 3 },
  { label: 'Domyos',            count: 3 },
  { label: 'ProForm',           count: 1 },
  { label: 'Rogue',             count: 3 },
  { label: 'BioTechUSA',        count: 1 },
  { label: 'Dymatize',          count: 1 },
  { label: 'Gymshark',          count: 1 },
  { label: 'Reebok',            count: 1 }
];

const COLORS = ['#4a4a4a', '#ffffff', '#c0392b', '#2980b9', '#27ae60', '#f39c12'];

const SIZES = [
  { label: 'XS', count: 2 },
  { label: 'S',  count: 2 },
  { label: 'M',  count: 6 },
  { label: 'L',  count: 6 },
  { label: 'XL', count: 5 },
];

// ── 3. HELPERS ────────────────────────────────────────────────
function toggleSet(arr, val) {
  return arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];
}

// ── PRODUCT CARD ──────────────────────────────────────────────
function ProductCard({ product, onViewDetail }) {
  const { addToCart } = useCart();
  const [wished, setWished] = useState(false);
  const [added,  setAdded]  = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    if (!product.inStock) return;
    addToCart({ id: product.id, name: product.name, price: product.price, img: product.img, qty: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div
      className={`pc-card ${!product.inStock ? 'out-of-stock-opacity' : ''}`}
      onClick={() => onViewDetail(product)}
      style={{ cursor: 'pointer' }}
    >
      <div className="pc-img-wrap">
        {product.badge && <span className="pc-badge">{product.badge}</span>}
        {!product.inStock && <span className="pc-badge out-tag">RUPTURE</span>}
        <button
          className={`pc-wish${wished ? ' on' : ''}`}
          onClick={(e) => { e.stopPropagation(); setWished(w => !w); }}
          aria-label="Wishlist"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill={wished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
        <img 
          src={product.img} 
          alt={product.name} 
          className="pc-img" 
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=500'; }}
        />
        <div className="pc-img-overlay" />
        <div className="pc-view-hint">Click to view details</div>
      </div>
      <div className="pc-body">
        <div className="pc-brand">{product.brand}</div>
        <div className="pc-name">{product.name}</div>
        <div className="pc-footer">
          <div className="pc-pricing">
            <span className="pc-price">{product.price.toLocaleString()} DZD</span>
            {product.oldPrice && <span className="pc-old">{product.oldPrice.toLocaleString()} DZD</span>}
          </div>
          <button
            className={`pc-add${added ? ' added' : ''}`}
            onClick={handleAdd}
            disabled={!product.inStock}
            aria-label="Add to cart"
          >
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
      <span className="sb-count">({count})</span>
    </label>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────
export default function Products({ filterSport = null }) {
  const [productsList, setProductsList] = useState(ALL_PRODUCTS);
  const [inStock,   setInStock]   = useState(true);
  const [outStock,  setOutStock]  = useState(true);
  const [priceMax,  setPriceMax]  = useState(40000);
  const [selTypes,  setSelTypes]  = useState([]);
  const [selBrands, setSelBrands] = useState([]);
  const [selColor,  setSelColor]  = useState(null);
  const [selSizes,  setSelSizes]  = useState([]);
  const [sideOpen,  setSideOpen]  = useState(false);
  const [detailProduct, setDetailProduct] = useState(null);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/products?limit=200`);
        if (response.ok) {
          const data = await response.json();
          if (data.products && data.products.length > 0) {
            const mapped = data.products.map(p => ({
              ...p,
              id: p._id || p.id,
              // Normalize missing fields
              name: p.name || p.title || 'Product',
              img: p.img || (p.images && p.images[0]) || (p.photos && p.photos[0]) || '',
              inStock: p.stock > 0
            }));
            setProductsList(mapped);
          }
        }
      } catch (err) {
        console.error('Failed to load products from API:', err);
      }
    };
    loadProducts();
  }, []);

  // ── FILTER ENGINE ───────────────────────────────────────────
  const filtered = useMemo(() => {
    return productsList.filter(product => {
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery) && !product.brand.toLowerCase().includes(searchQuery)) return false;
      if (filterSport && product.sport?.toLowerCase() !== filterSport.toLowerCase()) return false;
      if (!inStock && product.inStock) return false;
      if (!outStock && !product.inStock) return false;
      if (product.price > priceMax) return false;
      if (selTypes.length > 0 && !selTypes.includes(product.type)) return false;
      if (selBrands.length > 0) {
        const match = selBrands.some(b => b.toLowerCase() === product.brand.toLowerCase());
        if (!match) return false;
      }
      if (selColor && product.color !== selColor) return false;
      if (selSizes.length > 0 && !selSizes.includes(product.size)) return false;
      return true;
    });
  }, [productsList, searchQuery, filterSport, inStock, outStock, priceMax, selTypes, selBrands, selColor, selSizes]);

  const pct = Math.round((priceMax / 40000) * 100);

  const resetAllFilters = () => {
    setInStock(true);
    setOutStock(true);
    setPriceMax(40000);
    setSelTypes([]);
    setSelBrands([]);
    setSelColor(null);
    setSelSizes([]);
  };

  return (
    <>
      <section id="products" className="mp-wrap">
      <div className="mp-top">
        <div>
          <div className="mp-eyebrow">Marketplace</div>
          <h2 className="mp-heading"><span>ALL</span> <em>PRODUCTS</em></h2>
        </div>
        <div className="mp-top-right">
          <span className="mp-result-count">{filtered.length} products found</span>
          <button className="mp-filter-toggle" onClick={() => setSideOpen(o => !o)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/>
            </svg>
            Filters
          </button>
        </div>
      </div>

      <div className={`mp-body${sideOpen ? ' sidebar-open' : ''}`}>
        <aside className="mp-sidebar">
          <div className="sb-group">
            <div className="sb-title">AVAILABILITY</div>
            <CheckRow label="In Stock"     count={23} checked={inStock}  onChange={e => setInStock(e.target.checked)} />
            <CheckRow label="Out of Stock" count={2}  checked={outStock} onChange={e => setOutStock(e.target.checked)} />
          </div>

          <div className="sb-group">
            <div className="sb-title">PRICE RANGE</div>
            <div className="sb-range-wrap">
              <input
                type="range" min={0} max={40000} value={priceMax}
                style={{ '--pct': pct + '%' }}
                onChange={e => setPriceMax(Number(e.target.value))}
                className="sb-range"
              />
            </div>
            <div className="sb-range-labels"><span>0 DA</span><span>{priceMax.toLocaleString()} DA</span></div>
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

          <button className="reset-filters-btn" onClick={resetAllFilters}>
            RESET ALL FILTERS
          </button>
        </aside>

        <div className="mp-grid">
          {filtered.length === 0 ? (
            <div className="empty-catalog-box">
              <p>No products match your filters.</p>
              <button onClick={resetAllFilters} className="clear-btn">Reset Filters</button>
            </div>
          ) : (
            filtered.map(p => <ProductCard key={p.id} product={p} onViewDetail={setDetailProduct} />)
          )}
        </div>
      </div>
      </section>
      {detailProduct && <ProductDetailModal product={detailProduct} onClose={() => setDetailProduct(null)} />}
    </>
  );
}