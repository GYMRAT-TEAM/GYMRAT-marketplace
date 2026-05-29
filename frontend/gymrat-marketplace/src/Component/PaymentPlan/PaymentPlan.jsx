import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PaymentPlan.css';
import logoImg from '../Assets/logo.png';
import { upgradePlan } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function PaymentPlan() {
  const location = useLocation();
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const plan = location.state?.plan || { name: 'GymRat VIP Plan', price: '9990' };
  const upgradeMode = location.state?.upgradeMode || false; // true when coming from Settings

  // Step 1: 'select', Step 2: 'card-details'
  const [step, setStep] = useState('select');
  const [upgrading, setUpgrading] = useState(false);

  const [form, setForm] = useState({
    cardNumber: '',
    cvv: '',
    expDate: '',
    password: ''
  });

  const handleChange = (e) => {
    let { name, value } = e.target;
    
    if (name === 'cardNumber') {
      value = value.replace(/\D/g, '').substring(0, 16);
      value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    } else if (name === 'expDate') {
      value = value.replace(/\D/g, '').substring(0, 4);
      if (value.length >= 3) {
        value = `${value.substring(0, 2)}/${value.substring(2, 4)}`;
      }
    } else if (name === 'cvv') {
      value = value.replace(/\D/g, '').substring(0, 4);
    }

    setForm(prev => ({ ...prev, [name]: value }));
  };

  const displayPrice = plan.price === '00' ? '0' : (parseInt(plan.price)).toLocaleString();
  const numPrice = plan.price === '00' ? 0 : parseInt(plan.price);
  const vat = numPrice * 0.20;
  const total = numPrice + vat;

  const completePayment = async (paymentMethod) => {
    if (upgradeMode) {
      // Upgrade plan via API — no new account needed
      setUpgrading(true);
      try {
        const planName = plan.name.replace('GymRat ', '').replace(' Plan', '');
        const res = await upgradePlan(planName, paymentMethod);
        updateUser(res.data.user);
        navigate('/settings', { state: { upgraded: true, planName } });
      } catch (err) {
        alert(err.response?.data?.message || 'Upgrade failed. Please try again.');
      } finally {
        setUpgrading(false);
      }
    } else {
      navigate('/create-account', { state: { plan, paymentConfirmed: true, paymentMethod } });
    }
  };

  const handleSelectMethod = (m) => {
    if (m === 'card') {
      setStep('card-details');
    } else {
      completePayment(m);
    }
  };

  const handleProceed = async (e) => {
    e.preventDefault();
    if (!form.cardNumber || form.cardNumber.length < 19 || form.expDate.length < 5 || form.cvv.length < 3 || !form.password) {
      alert("Please fill in all card details correctly");
      return;
    }
    await completePayment('card');
  };

  const handleBack = () => {
    if (step === 'card-details') {
      setStep('select');
    }
  };

  return (
    <div className="payment-plan-page">
      <div className="payment-glow payment-glow-1" />
      <div className="payment-glow payment-glow-2" />

      {/* ─── STEP 1 ─── */}
      {step === 'select' && (
        <div className="step-1-container">
          <div className="s1-header">
            <div className="s1-logo">
              <a href="/" className="signup-logo">
                        <img src={logoImg} alt="Gym Rat" className="signup-logo-img" />
                        <div>
                          <div className="signup-logo-text">GYMRAT</div>
                          <div className="signup-logo-sub">MARKETPLACE</div>
                        </div>
                      </a>
            
            
            </div>
          </div>

          <div className="s1-bill">
            <div className="s1-bill-title">Your bill</div>
            <div className="s1-bill-items">
              <div>GymRat Marketplace</div>
              <div>{plan.name}</div>
              <div>1 month x DZD {displayPrice} <span>= DZD {displayPrice}</span></div>
            </div>
          </div>

          <div className="s1-main-title">Select a payment method</div>
          <div className="s1-main-subtitle">Select a payment method you want to use to pay for your subscription.</div>

          <div className="s1-methods">
            <div className="s1-method-btn" onClick={() => handleSelectMethod('paypal')}>
              <div className="s1-method-left">
                Paypal
                <div className="s1-method-icons">
                  <svg viewBox="0 0 24 24" fill="#003087"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"/></svg>
                </div>
              </div>
              <div className="s1-arrow">›</div>
            </div>

            <div className="s1-method-btn" onClick={() => handleSelectMethod('card')}>
              <div className="s1-method-left">
                Card
                <div className="s1-method-icons">
                  
                </div>
              </div>
              <div className="s1-arrow">›</div>
            </div>

            
          </div>
        </div>
      )}

      {/* ─── STEP 2 ─── */}
      {step === 'card-details' && (
        <div className="step-2-container">
          <button className="s2-close" onClick={handleBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>

          {/* LEFT: FORM */}
          <div className="s2-left">
            <div className="s2-logo">
              <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                <path d="M21 4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H3V6h18v12z"/>
                <path d="M5 8h14v2H5zM5 12h8v2H5z"/>
              </svg>
               
            </div>

            <form className="s2-form" onSubmit={handleProceed}>
              {/* Card Number */}
              <div className="s2-field">
                <div className="s2-field-row">
                  <label className="s2-label">Card Number</label>
                  <span className="s2-desc">Edit</span>
                </div>
                <div className="s2-input-w-icon">
                  <input 
                    type="text" 
                    name="cardNumber"
                    className="s2-input" 
                    placeholder=""
                    value={form.cardNumber}
                    onChange={handleChange}
                  />
                  <div className="s2-input-icon">
                  
                    <svg viewBox="0 0 24 24" fill="#00c853" width="16" height="16"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                  </div>
                </div>
              </div>

              <div className="s2-row-inputs">
                {/* CVV Number */}
                <div className="s2-field">
                  <div className="s2-field-row">
                    <label className="s2-label">CVV Number</label>
                  </div>
                  <div className="s2-desc" style={{marginBottom:'0.25rem'}}>Enter the 3 or 4 digit number on the card</div>
                  <div className="s2-input-w-icon">
                    <input 
                      type="text" 
                      name="cvv"
                      className="s2-input" 
                      placeholder=""
                      value={form.cvv}
                      onChange={handleChange}
                    />
                    <div className="s2-input-icon">
                      
                    </div>
                  </div>
                </div>

                {/* Expiry Date */}
                <div className="s2-field">
                  <div className="s2-field-row">
                    <label className="s2-label">Expiry Date</label>
                  </div>
                  <div className="s2-desc" style={{marginBottom:'0.25rem'}}>Enter the expiration date of the card</div>
                  <div className="s2-input-w-icon">
                    <input 
                      type="text" 
                      name="expDate"
                      className="s2-input" 
                      placeholder=""
                      value={form.expDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

               {/* Password */}
               <div className="s2-field">
                  <div className="s2-field-row">
                    <label className="s2-label">Password</label>
                  </div>
                  <div className="s2-desc" style={{marginBottom:'0.25rem'}}>Enter your Dynamic password</div>
                  <div className="s2-input-w-icon">
                    <input 
                      type="password" 
                      name="password"
                      className="s2-input" 
                      placeholder="••••••••"
                      value={form.password}
                      onChange={handleChange}
                    />
                    <div className="s2-input-icon">
                      
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/><circle cx="15.5" cy="8.5" r="1.5"/>
                        <circle cx="8.5" cy="15.5" r="1.5"/><circle cx="15.5" cy="15.5" r="1.5"/>
                      
                    </div>
                  </div>
                </div>

              <button type="submit" className="s2-pay-btn" disabled={upgrading}>
                {upgrading ? 'Processing…' : 'Pay Now'}
              </button>
            </form>
          </div>

          {/* RIGHT: SUMMARY & VISUAL */}
          <div className="s2-right">
            
            <div className="s2-visual-card">
              <div className="vac-chip"></div>
              <svg className="vac-nfc" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                <path d="M5 2c-1.5 2.5-1.5 6 0 8M9 0c-2.5 3.5-2.5 8.5 0 12M13 -2c-3.5 4.5-3.5 10.5 0 15"/>
              </svg>
              <div className="vac-name">GymRat Member</div>
              <div className="vac-num">
                <span className="vac-dots">••••</span> 
                {form.cardNumber ? form.cardNumber.slice(-4) : ''}
              </div>
              <div className="vac-bottom">
                <div className="vac-exp">{form.expDate || ''}</div>
                
              </div>
            </div>

            <div className="s2-summary-list">
              <div className="s2-sum-row">
                <span className="s2-sum-label">Company</span>
                <span className="s2-sum-val">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                     <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                  </svg>
                  GymRat
                </span>
              </div>
              <div className="s2-sum-row">
                <span className="s2-sum-label">Order Number</span>
                <span className="s2-sum-val">.......</span>
              </div>
              <div className="s2-sum-row">
                <span className="s2-sum-label">Product</span>
                <span className="s2-sum-val">{plan.name}</span>
              </div>
              <div className="s2-sum-row">
                <span className="s2-sum-label">VAT (20%)</span>
                <span className="s2-sum-val">DZD {vat.toLocaleString()}</span>
              </div>
            </div>

            <div className="s2-divider"></div>

            <div className="s2-total-row">
              <div>
                <div className="s2-total-label">You have to Pay</div>
                <div className="s2-total-val">
                  {total.toLocaleString()} <span className="s2-total-currency">DZD</span>
                </div>
              </div>
              <div className="s2-receipt-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 2v20l2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2V2z"/>
                  <rect x="8" y="6" width="8" height="2"/>
                  <rect x="8" y="10" width="8" height="2"/>
                  <rect x="8" y="14" width="4" height="2"/>
                </svg>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
