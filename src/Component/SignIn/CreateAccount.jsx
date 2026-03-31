import { useState } from 'react';
import './CreateAccount.css';
import logoImg from '../Assets/logo.png';
import { useNavigate, useLocation } from 'react-router-dom';

export default function CreateAccount() {
  const navigate = useNavigate();
  const location = useLocation();
  const plan = location.state?.plan || null;

  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [form, setForm] = useState({
    fullName: '',
    age: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreed) return;
    console.log('Creating account:', { plan: plan?.name, ...form });
    navigate('/dashboard');
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
          <p className="ca-sub">
           
          </p>

          {/* Selected Plan Box */}
          {plan && (
            <div className="ca-plan-box">
              <div className="ca-plan-label">Selected Plan</div>
              <div className="ca-plan-name">{plan.name}</div>
              <div className="ca-plan-price">
                DZD {plan.price === '00' ? '0' : parseInt(plan.price).toLocaleString()} / month
              </div>
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
            <button className="ca-lang-btn"> English (DZ) ▾</button>
          </div>

          <h2 className="ca-form-title">Create Account</h2>

          <form onSubmit={handleSubmit} className="ca-form" autoComplete="off">

            {/* Full Name */}
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

            {/* Age */}
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

            {/* Email */}
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

            {/* Password */}
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
                onClick={() => setShowPassword((v) => !v)}
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

            {/* Terms */}
            <div className="ca-checkbox-row">
              <input
                type="checkbox"
                id="ca-tos"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <label htmlFor="ca-tos">
                I agree to the <a href="/terms">terms of service</a> and <a href="/privacy">privacy policy</a>
              </label>
            </div>

            <button type="submit" className="ca-submit" disabled={!agreed}>
              Sign Up
            </button>

            <div className="ca-divider">
              <hr /><span>Or Sign Up With</span><hr />
            </div>

            {/* Social buttons */}
           <div className="signin-socials">
              <button className="signin-social-btn">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
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