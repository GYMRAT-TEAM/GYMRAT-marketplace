import React, { useState } from 'react';
import './CreateAccount.css';
import logoImg from '../Assets/logo.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

export default function CreateAccount() {
  const { register, loginWithGoogle, error: authError } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const plan             = location.state?.plan           || null;
  const paymentConfirmed = location.state?.paymentConfirmed || false;
  const paymentMethod    = location.state?.paymentMethod    || 'cash_on_delivery';

  const [showPassword, setShowPassword] = useState(false);
  const [agreed,       setAgreed]       = useState(true);
  const [localError,   setLocalError]   = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    age:      '',
    email:    '',
    password: '',
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ── Map plan name to planKey for backend
  const getPlanKey = () => {
    if (!plan) return 'standard';
    const name = plan.name?.toLowerCase() || '';
    if (name.includes('business')) return 'business';
    if (name.includes('vip'))      return 'vip';
    return 'standard';
  };

  // ── Email/Password signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) return;

    const nameParts = form.fullName.trim().split(' ');
    const firstName = nameParts[0]               || 'User';
    const lastName  = nameParts.slice(1).join(' ') || 'GymRat';

    const userData = {
      firstName,
      lastName,
      email:         form.email,
      password:      form.password,
      age:           form.age ? parseInt(form.age) : undefined,
      plan:          getPlanKey(),
      paymentMethod,
    };

    setLocalError('');
    setIsSubmitting(true);
    const result = await register(userData);
    setIsSubmitting(false);

    if (result.success) {
      if (result.data?.user?.role === 'super_admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      setLocalError(result.error);
    }
  };

  // ── Google signup on this page (carries the selected plan)
  const handleGoogleSuccess = async (credentialResponse) => {
    setLocalError('');
    const result = await loginWithGoogle(credentialResponse, getPlanKey());
    if (result.success) {
      if (result.data?.user?.role === 'super_admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      setLocalError(result.error);
    }
  };

  return (
    <div className="ca-page">
      <div className="ca-glow ca-glow-1" />
      <div className="ca-glow ca-glow-2" />

      <div className="ca-card">

        {/* ── LEFT PANEL ── */}
        <div className="ca-left">
          <button className="ca-back-btn" onClick={() => navigate('/signup')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Plans
          </button>

          <a href="/" className="ca-logo">
            <img src={logoImg} alt="GymRat" className="ca-logo-img" />
            <div>
              <div className="ca-logo-text">GYMRAT</div>
              <div className="ca-logo-sub">MARKETPLACE</div>
            </div>
          </a>

          <h2 className="ca-headline">
            Train Hard.<br />
            <span>Shop Smarter.</span>
          </h2>

          {/* Selected Plan Box */}
          {plan && (
            <div className="ca-plan-box">
              <div className="ca-plan-label">Selected Plan</div>
              <div className="ca-plan-name">{plan.name}</div>
              <div className="ca-plan-price">
                DZD {plan.price === '00' ? '0' : parseInt(plan.price).toLocaleString()} / month
              </div>
              {paymentConfirmed && (
                <div className="ca-payment-verified">
                  <span className="check">✓</span>
                  Payment Method: {paymentMethod.toUpperCase().replace(/_/g, ' ')}
                </div>
              )}
              <ul className="ca-plan-features">
                {plan.features.slice(0, 3).map((f) => (
                  <li key={f}><span>✓</span>{f}</li>
                ))}
                {plan.features.length > 3 && (
                  <li className="ca-plan-more">+{plan.features.length - 3} more features</li>
                )}
              </ul>
            </div>
          )}

          <div className="ca-deco-icons">
            <div className="ca-deco"></div>
            <div className="ca-deco"></div>
            <div className="ca-deco"></div>
            <div className="ca-deco"></div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="ca-right">
          <div className="ca-lang-row">
            <button className="ca-lang-btn">English (DZ) ▾</button>
          </div>

          <h2 className="ca-form-title">Create Account</h2>

          <form onSubmit={handleSubmit} className="ca-form" autoComplete="off">

            {(localError || authError) && (
              <div className="signin-error-msg" style={{
                color: '#ff4d4d',
                fontSize: '0.85rem',
                marginBottom: '1rem',
                textAlign: 'center',
                padding: '8px',
                background: 'rgba(255, 77, 77, 0.1)',
                borderRadius: '4px',
              }}>
                {localError || authError}
              </div>
            )}

            <div className="ca-field">
              <input
                type="text"
                name="fullName"
                className="ca-input"
                placeholder="Full Name"
                value={form.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="ca-field">
              <input
                type="number"
                name="age"
                className="ca-input"
                placeholder="Age"
                min="13"
                max="100"
                value={form.age}
                onChange={handleChange}
                required
              />
            </div>

            <div className="ca-field">
              <input
                type="email"
                name="email"
                className="ca-input"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="ca-field ca-field-pw">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="ca-input"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="ca-eye"
                onClick={() => setShowPassword(v => !v)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                )}
              </button>
            </div>

            <div className="ca-checkbox-row">
              <input
                type="checkbox"
                id="ca-tos"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
              />
              <label htmlFor="ca-tos">
                I agree to the <a href="/terms">terms of service</a> and <a href="/privacy">privacy policy</a>
              </label>
            </div>

            <button
              type="submit"
              className="ca-submit"
              disabled={!agreed || isSubmitting}
            >
              {isSubmitting ? 'Creating account...' : 'Sign Up'}
            </button>

            <div className="ca-divider">
              <hr /><span>Or Sign Up With</span><hr />
            </div>

            {/* ── Real Google Login button */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setLocalError('Google Sign-In failed. Please try again.')}
                text="continue_with"
                shape="rectangular"
                width="360"
              />
            </div>

            <div className="ca-signin-prompt">
              Already have an account? <a href="/signin">Sign in</a>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}