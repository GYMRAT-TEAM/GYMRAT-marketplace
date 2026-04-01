import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import logoImg from '../Assets/logo.png';
import './Checkout.css';

// ── PRODUCTS DATA ─────────────────────────────────────────────
const PRODUCTS = [
  { id: 1, name: 'Product 1',  price: 68,  oldPrice: 95,  badge: 'HOT',  category: 'apparel',   desc: 'High-performance moisture-wicking fabric.' },
  { id: 2, name: 'Product 2',   price: 280, oldPrice: null, badge: 'PRO',  category: 'equipment', desc: 'Precision-machined steel with aggressive knurling.' },
  { id: 3, name: 'Product 3',       price: 54,  oldPrice: 70,  badge: 'NEW',  category: 'nutrition', desc: '25g protein per serving, zero fillers.' },
  { id: 4, name: 'Product 4',price: 42,  oldPrice: null, badge: null,   category: 'apparel',   desc: '4-way stretch, anti-chafe lining.' },
  { id: 5, name: 'Product 5',     price: 29,  oldPrice: 40,  badge: null,   category: 'equipment', desc: 'Full-palm protection with ventilated mesh.' },
  { id: 6, name: 'Product 6', price: 38,  oldPrice: 55,  badge: 'SALE', category: 'nutrition', desc: 'Recovery-optimized formula.' },
];

const SHIP_OPTIONS = [
  { label: 'Standard Shipping', eta: '5–7  days', price: 0,  display: 'FREE' },
  { label: 'Express Shipping',  eta: '2–3  days', price: 12, display: 'DZA 12' },
  { label: 'Overnight Delivery',eta: 'Next day', price: 28, display: 'DZA 28' },
];

// ── STEP INDICATOR ─────────────────────────────────────────────
function StepBar({ step }) {
  const steps = ['Shop', 'Shipping', 'Payment'];
  return (
    <div className="ck-steps">
      {steps.map((label, i) => {
        const n = i + 1;
        const isDone   = n < step;
        const isActive = n === step;
        return (
          <div key={n} className={`ck-step ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}>
            <div className="ck-step-num">{isDone ? '✓' : n}</div>
            <span>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── STEP 1 : SHOP ──────────────────────────────────────────────
function StepShop({ onNext }) {
  const { cartItems, cartCount, subtotal, tax, total, addToCart, removeFromCart } = useCart();
  const [qtys, setQtys] = useState(() => Object.fromEntries(PRODUCTS.map(p => [p.id, 1])));

  const changeLocalQty = (id, delta) => {
    setQtys(prev => ({ ...prev, [id]: Math.max(1, Math.min(10, prev[id] + delta)) }));
  };

  const isInCart = (id) => cartItems.some(i => i.id === id);

  return (
    <div className="ck-shop-layout">
      <div className="ck-products">
        {PRODUCTS.map(p => (
          <div key={p.id} className={`ck-product-card ${isInCart(p.id) ? 'in-cart' : ''}`}>
            <div className={`ck-product-img ck-cat-${p.category}`}>
              {p.badge && <span className="ck-product-badge">{p.badge}</span>}
              <div className="ck-product-placeholder-icon"></div>
            </div>
            <div className="ck-product-body">
              <div className="ck-product-name">{p.name}</div>
              <div className="ck-product-pricing">
                <span className="ck-price">DZA {p.price}</span>
                {p.oldPrice && <span className="ck-price-old">DZA {p.oldPrice}</span>}
              </div>
              <div className="ck-product-footer">
                <div className="ck-qty">
                  <button className="ck-qty-btn" onClick={() => changeLocalQty(p.id, -1)}>−</button>
                  <span className="ck-qty-val">{qtys[p.id]}</span>
                  <button className="ck-qty-btn" onClick={() => changeLocalQty(p.id, +1)}>+</button>
                </div>
                {isInCart(p.id) ? (
                  <button className="ck-remove-btn" onClick={() => removeFromCart(p.id)}>Remove</button>
                ) : (
                  <button className="ck-add-btn" onClick={() => addToCart({ ...p, qty: qtys[p.id] })}>ADD</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <aside className="ck-cart-sidebar">
        <div className="ck-sidebar-title">🛒 YOUR CART</div>
        <div className="ck-cart-items">
          {cartItems.length === 0 ? (
            <p className="ck-empty">No items yet.</p>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="ck-cart-item">
                <div className="ck-cart-info">
                  <div className="ck-cart-name">{item.name}</div>
                  <div className="ck-cart-sub">DZA {item.price} × {item.qty}</div>
                </div>
                <div className="ck-cart-item-right">
                  <span className="ck-cart-total">DZA {(item.price * item.qty).toFixed(2)}</span>
                  <button className="ck-cart-remove" onClick={() => removeFromCart(item.id)}>✕</button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="ck-divider" />
        <div className="ck-summary-row"><span>Subtotal</span><span>DZA {subtotal.toFixed(2)}</span></div>
        <div className="ck-summary-row"><span>Tax (0%)</span><span>DZA {tax.toFixed(2)}</span></div>
        <div className="ck-divider" />
        <div className="ck-summary-row ck-total-row"><span>Total</span><span>DZA {total.toFixed(2)}</span></div>
        <button className="ck-proceed-btn" disabled={cartCount === 0} onClick={onNext}>PROCEED TO SHIPPING →</button>
      </aside>
    </div>
  );
}

// ── STEP 2 : SHIPPING ──────────────────────────────────────────
function StepShipping({ onNext, onBack }) {
  const { setShippingCost } = useCart();
  const [selectedShip, setSelectedShip] = useState(0);

  const handleShipSelect = (idx, price) => {
    setSelectedShip(idx);
    setShippingCost(price);
  };

  return (
    <div className="ck-shipping-layout">
      <div className="ck-shipping-visual">
        <div className="ck-box-stack">
          <span style={{ fontSize: 60 }}></span>
        </div>
        <div className="ck-ship-visual-text">
          <h3>FAST SHIPPING</h3>
          <p>Global tracking enabled.</p>
        </div>
      </div>

      <div className="ck-shipping-form">
        <div className="ck-form-title">SHIPPING DETAILS</div>
        <div className="ck-form-grid">
          <div className="ck-field"><label>First Name</label><div className="ck-field-wrap"><span></span><input placeholder="...." /></div></div>
          <div className="ck-field"><label>Last Name</label><div className="ck-field-wrap"><span></span><input placeholder="...." /></div></div>
          <div className="ck-field ck-full"><label>Street Address</label><div className="ck-field-wrap"><span></span><input placeholder="...." /></div></div>
          <div className="ck-field"><label>City</label><div className="ck-field-wrap"><span></span><input placeholder="...." /></div></div>
          <div className="ck-field"><label>Postal Code</label><div className="ck-field-wrap"><span></span><input placeholder="...." /></div></div>
        </div>

        <div className="ck-ship-method-label">Method</div>
        <div className="ck-ship-options">
          {SHIP_OPTIONS.map((opt, idx) => (
            <div key={idx} className={`ck-ship-option ${selectedShip === idx ? 'selected' : ''}`} onClick={() => handleShipSelect(idx, opt.price)}>
              <div className="ck-ship-radio" />
              <div className="ck-ship-info"><div className="ck-ship-name">{opt.label}</div><div className="ck-ship-eta">{opt.eta}</div></div>
              <div className="ck-ship-price">{opt.display}</div>
            </div>
          ))}
        </div>
        <div className="ck-form-actions">
          <button className="ck-back-btn" onClick={onBack}>← BACK</button>
          <button className="ck-next-btn" onClick={onNext}>CONTINUE TO PAYMENT →</button>
        </div>
      </div>
    </div>
  );
}

// ── STEP 3 : PAYMENT ──────────────────────────────────────────
function StepPayment({ onNext, onBack }) {
  const { total, shippingCost, subtotal, tax } = useCart();
  const [card, setCard] = useState({ name: '', number: '', month: '', year: '', cvv: '' });

  const fmtNumber = (v) => v.replace(/\D/g,'').substring(0,16).replace(/(.{4})/g,'$1 ').trim();

  return (
    <div className="ck-payment-layout">
      <div className="ck-card-visual">
        <div className="ck-credit-card">
          <div className="ck-chip"><div/><div/><div/><div/></div>
          <div className="ck-card-number">{card.number.padEnd(16, '•').replace(/(.{4})/g,'$1 ')}</div>
          <div className="ck-card-bottom">
            <div><div className="ck-card-label">Cardholder</div><div className="ck-card-value">{card.name || 'FULL NAME'}</div></div>
          </div>
        </div>
        <div className="ck-pay-summary">
          <div className="ck-pay-row"><span>Subtotal</span><span>DZA {subtotal.toFixed(2)}</span></div>
          <div className="ck-pay-row"><span>Shipping</span><span>DZA {shippingCost.toFixed(2)}</span></div>
          <div className="ck-divider" />
          <div className="ck-pay-row ck-pay-total"><span>Total</span><span>DZA {total.toFixed(2)}</span></div>
        </div>
      </div>

      <div className="ck-payment-form">
        <div className="ck-form-title">PAYMENT</div>
        <div className="ck-card-fields">
          <div className="ck-field ck-full"><label>Name</label><div className="ck-field-wrap"><input value={card.name} onChange={e => setCard({...card, name: e.target.value})} placeholder="...." /></div></div>
          <div className="ck-field ck-full"><label>Number</label><div className="ck-field-wrap"><input value={card.number} onChange={e => setCard({...card, number: fmtNumber(e.target.value)})} placeholder="0000 0000 0000 0000" /></div></div>
          <div className="ck-field"><label>MM/YY</label><div className="ck-field-wrap"><input placeholder="01/02/2026" /></div></div>
          <div className="ck-field"><label>CVV</label><div className="ck-field-wrap"><input type="password" placeholder="•••" /></div></div>
        </div>
        <div className="ck-form-actions">
          <button className="ck-back-btn" onClick={onBack}>← BACK</button>
          <button className="ck-pay-btn" onClick={onNext}> PAY DZA {total.toFixed(2)}</button>
        </div>
      </div>
    </div>
  );
}

// ── STEP 4 : SUCCESS ──────────────────────────────────────────
function StepSuccess({ onClose }) {
  return (
    <div className="ck-success">
      <div className="ck-success-icon"></div>
      <h2 className="ck-success-title">ORDER CONFIRMED!</h2>
      <button className="ck-continue-btn" onClick={onClose}>CONTINUE SHOPPING</button>
    </div>
  );
}

// ── MAIN MODAL ────────────────────────────────────────────────
export default function CheckoutModal({ onClose }) {
  const [step, setStep] = useState(1);
  const { clearCart } = useCart();

  const handleClose = () => { if(step === 4) clearCart(); onClose(); };

  return (
    <div className="ck-overlay" onClick={e => e.target === e.currentTarget && handleClose()}>
      <div className="ck-modal">
        <div className="ck-modal-header">
          {/* ── LOGO IMAGE INCLUDED ── */}
          <div className="ck-modal-logo">
            <img src={logoImg} alt="GYMRAT Logo" className="ck-modal-logo-img" />
            <span className="ck-modal-logo-text">GYMRAT</span>
            <div className="signup-logo-sub">MARKETPLACE</div>
          </div>

          {step < 4 && <StepBar step={step} />}
          <button className="ck-close-btn" onClick={handleClose}>✕</button>
        </div>
        <div className="ck-modal-body">
          {step === 1 && <StepShop onNext={() => setStep(2)} />}
          {step === 2 && <StepShipping onNext={() => setStep(3)} onBack={() => setStep(1)} />}
          {step === 3 && <StepPayment onNext={() => setStep(4)} onBack={() => setStep(2)} />}
          {step === 4 && <StepSuccess onClose={handleClose} />}
        </div>
      </div>
    </div>
  );
}