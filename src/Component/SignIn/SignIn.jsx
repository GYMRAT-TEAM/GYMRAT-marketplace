import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import './SignIn.css';
import logoImg from '../Assets/logo.png';

export default function SignIn() {
  const { login, loginWithGoogle, error: authError } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [localError, setLocalError]   = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Email/Password Sign In
  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    setLocalError('');
    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      if (result.data.user.role === 'super_admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      setLocalError(result.error);
    }
  };

  // ── Google Sign In
  // Sign in keeps the user's existing plan — no plan selection needed here
  const handleGoogleSuccess = async (credentialResponse) => {
    setLocalError('');
    const result = await loginWithGoogle(credentialResponse, 'standard');

    if (result.success) {
      if (result.data.user.role === 'super_admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      setLocalError(result.error || 'Google Sign-In failed.');
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-glow signin-glow-1"></div>
      <div className="signin-glow signin-glow-2"></div>

      <div className="signin-container">

        {/* Logo */}
        <a href="/" className="signup-logo">
          <img src={logoImg} alt="Gym Rat" className="signup-logo-img" />
          <div className="logo-text-wrapper">
            <div className="signup-logo-text">GYMRAT</div>
            <div className="signup-logo-sub">MARKETPLACE</div>
          </div>
        </a>

        {/* Card */}
        <div className="signin-card">
          <div className="signin-card-header">
            <div className="signin-badge">WELCOME BACK</div>
            <h1 className="signin-title">SIGN IN TO YOUR <span>ACCOUNT</span></h1>
            <p className="signin-subtitle">Access your orders, wishlist and community</p>
          </div>

          <form className="signin-form" onSubmit={handleSignIn}>

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

            <div className="signin-field">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="you@GYMRAT.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="signin-field">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="signin-options">
              <label className="signin-remember">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              className="signin-btn"
              style={{ width: '100%', marginBottom: '1rem', opacity: isSubmitting ? 0.7 : 1 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'SIGNING IN...' : 'SIGN IN'}
            </button>

            <div className="signin-divider">
              <span>OR CONTINUE WITH</span>
            </div>

            {/* ── Real Google Login button */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setLocalError('Google Sign-In failed. Please try again.')}
                text="signin_with"
                shape="rectangular"
                width="360"
              />
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="signin-footer">
          Don't have an account?
          <a href="/signup"> Create one free →</a>
        </div>

      </div>
    </div>
  );
}