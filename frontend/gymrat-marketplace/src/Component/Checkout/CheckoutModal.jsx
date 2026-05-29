import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import logoImg from '../Assets/logo.png';
import './Checkout.css';

const SHIP_OPTIONS = [
  { label: 'Standard Shipping', eta: '5–7  days', price: 0, display: 'FREE' },
  { label: 'Express Shipping', eta: '2–3  days', price: 12, display: 'DZA 12' },
  { label: 'Overnight Delivery', eta: 'Next day', price: 28, display: 'DZA 28' },
];

function StepBar({ step }) {
  const steps = ['Review', 'Shipping', 'Payment'];
  return (
    <div className="ck-steps">
      {steps.map((label, i) => {
        const n = i + 1;
        const isDone = n < step;
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

function StepShop({ onNext }) {
  const { cartItems, cartCount, subtotal, tax, total, updateQty, removeFromCart } = useCart();
  const FALLBACK_IMG = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=500';

  return (
    <div className="ck-shop-layout" style={{ gridTemplateColumns: '1fr 340px' }}>
      <div className="ck-products" style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', paddingRight: '1rem' }}>
        <h2 style={{ marginBottom: '8px', fontSize: '20px', fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '2px' }}>Review Your Cart</h2>
        {cartItems.length === 0 ? (
          <div style={{ color: 'var(--muted)', textAlign: 'center', marginTop: '3rem' }}>Your cart is empty.</div>
        ) : (
          cartItems.map(item => (
            <div key={item.id} style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '14px', padding: '12px', transition: 'border-color .2s',
            }}>
              <div style={{
                width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden',
                flexShrink: 0, background: '#111',
              }}>
                <img
                  src={item.img || FALLBACK_IMG}
                  alt={item.name}
                  onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMG; }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '15px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                <div style={{ fontSize: '14px', color: '#b22234', fontWeight: 700, marginTop: '4px' }}>DZA {item.price.toLocaleString()}</div>
              </div>
              <div className="ck-qty" style={{ marginLeft: 'auto' }}>
                <button className="ck-qty-btn" onClick={() => updateQty(item.id, item.qty - 1)}>-</button>
                <span className="ck-qty-val">{item.qty}</span>
                <button className="ck-qty-btn" onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                style={{
                  width: '32px', height: '32px', borderRadius: '8px', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)',
                  background: 'transparent', color: '#ff5d5d', cursor: 'pointer', fontSize: '14px',
                  transition: '.2s', flexShrink: 0,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
          ))
        )}
      </div>

      <aside className="ck-cart-sidebar">
        <div className="ck-sidebar-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" /></svg>
          SUMMARY
        </div>
        <div className="ck-cart-items">
          {cartItems.map(item => (
            <div key={item.id} className="ck-cart-item">
              <div className="ck-cart-info">
                <div className="ck-cart-name">{item.name}</div>
                <div className="ck-cart-sub">DZA {item.price.toLocaleString()} x {item.qty}</div>
              </div>
              <div className="ck-cart-item-right">
                <span className="ck-cart-total">DZA {(item.price * item.qty).toLocaleString()}</span>
              </div>
            </div>
          ))}
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

function StepShipping({ address, onChange, onNext, onBack }) {
  const { setShippingCost } = useCart();
  const [selectedShip, setSelectedShip] = useState(0);

  const handleShipSelect = (idx, price) => {
    setSelectedShip(idx);
    setShippingCost(price);
  };

  const handleInputChange = (field, val) => {
    onChange({ ...address, [field]: val });
  };

  return (
    <div className="ck-shipping-layout">
      <div className="ck-shipping-visual">
        <div className="ck-box-stack">
          <span style={{ fontSize: 60 }}>📦</span>
        </div>
        <div className="ck-ship-visual-text">
          <h3>FAST SHIPPING</h3>
          <p>Global tracking enabled.</p>
        </div>
      </div>

      <div className="ck-shipping-form">
        <div className="ck-form-title">SHIPPING DETAILS</div>
        <div className="ck-form-grid">
          <div className="ck-field"><label>First Name</label><div className="ck-field-wrap"><input value={address.firstName} onChange={e => handleInputChange('firstName', e.target.value)} placeholder="First name" required /></div></div>
          <div className="ck-field"><label>Last Name</label><div className="ck-field-wrap"><input value={address.lastName} onChange={e => handleInputChange('lastName', e.target.value)} placeholder="Last name" required /></div></div>
          <div className="ck-field ck-full"><label>Street Address</label><div className="ck-field-wrap"><input value={address.street} onChange={e => handleInputChange('street', e.target.value)} placeholder="Street name and house number" required /></div></div>
          <div className="ck-field"><label>City</label><div className="ck-field-wrap"><input value={address.city} onChange={e => handleInputChange('city', e.target.value)} placeholder="City" required /></div></div>
          <div className="ck-field"><label>Postal Code</label><div className="ck-field-wrap"><input value={address.postalCode} onChange={e => handleInputChange('postalCode', e.target.value)} placeholder="Postal code" required /></div></div>
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
          <button className="ck-next-btn" onClick={() => {
            if (!address.firstName || !address.lastName || !address.street || !address.city || !address.postalCode) {
              alert('Please fill out all shipping details.');
              return;
            }
            onNext();
          }}>CONTINUE TO PAYMENT →</button>
        </div>
      </div>
    </div>
  );
}

function StepPayment({ address, onNext, onBack }) {
  const { total, shippingCost, subtotal } = useCart();
  const [card, setCard] = useState({ name: '', number: '', month: '', year: '', cvv: '' });
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState('');

  const fmtNumber = (v) => v.replace(/\D/g, '').substring(0, 16).replace(/(.{4})/g, '$1 ').trim();

  const handlePay = async () => {
    setPaying(true);
    setPayError('');
    try {
      const token = localStorage.getItem('gymrat_token');
      const res = await fetch('http://localhost:5001/api/orders/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          items: [],
          totalAmount: total,
          paymentMethod: 'card',
          shippingAddress: address,
        }),
      });
      if (res.ok) {
        onNext();
      } else {
        const data = await res.json();
        if (res.status === 401) { onNext(); return; }
        setPayError(data.message || 'Payment failed. Please try again.');
      }
    } catch (err) {
      onNext();
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="ck-payment-layout">
      <div className="ck-card-visual">
        <div className="ck-credit-card">
          <div className="ck-chip"><div /><div /><div /><div /></div>
          <div className="ck-card-number">{card.number.padEnd(16, '•').replace(/(.{4})/g, '$1 ')}</div>
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
        {payError && (
          <div style={{ color: '#ff5d5d', background: 'rgba(255,93,93,0.1)', border: '1px solid rgba(255,93,93,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 12, fontSize: 13 }}>
            {payError}
          </div>
        )}
        <div className="ck-card-fields">
          <div className="ck-field ck-full"><label>Name</label><div className="ck-field-wrap"><input value={card.name} onChange={e => setCard({ ...card, name: e.target.value })} placeholder="......" /></div></div>
          <div className="ck-field ck-full"><label>Number</label><div className="ck-field-wrap"><input value={card.number} onChange={e => setCard({ ...card, number: fmtNumber(e.target.value) })} placeholder="0000 0000 0000 0000" /></div></div>
          <div className="ck-field"><label>MM/YY</label><div className="ck-field-wrap"><input placeholder="01/02/2026" /></div></div>
          <div className="ck-field"><label>CVV</label><div className="ck-field-wrap"><input type="password" placeholder="•••" /></div></div>
        </div>
        <div className="ck-form-actions">
          <button className="ck-back-btn" onClick={onBack} disabled={paying}>← BACK</button>
          <button className="ck-pay-btn" onClick={handlePay} disabled={paying}>
            {paying ? 'PROCESSING...' : ` PAY DZA ${total.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
}

function StepSuccess({ onClose }) {
  return (
    <div className="ck-success">
      <div className="ck-success-icon"></div>
      <h2 className="ck-success-title">ORDER CONFIRMED!</h2>
      <button className="ck-continue-btn" onClick={onClose}>CONTINUE SHOPPING</button>
    </div>
  );
}

export default function CheckoutModal({ onClose }) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const { clearCart } = useCart();
  const [shippingAddress, setShippingAddress] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    street: user?.street || '',
    city: user?.city || '',
    postalCode: user?.postalCode || ''
  });

  const handleClose = () => { if (step === 4) clearCart(); onClose(); };

  return (
    <div className="ck-overlay" onClick={e => e.target === e.currentTarget && handleClose()}>
      <div className="ck-modal">
        <div className="ck-modal-header">
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
          {step === 2 && <StepShipping address={shippingAddress} onChange={setShippingAddress} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
          {step === 3 && <StepPayment address={shippingAddress} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
          {step === 4 && <StepSuccess onClose={handleClose} />}
        </div>
      </div>
    </div>
  );
}