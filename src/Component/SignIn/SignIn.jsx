import './SignIn.css';
import logoImg from '../Assets/logo.png';

export default function SignIn() {
  return (
    <div className="signin-page">
      {/* Background Glows */}
      <div className="signin-glow signin-glow-1"></div>
      <div className="signin-glow signin-glow-2"></div>

      <div className="signin-container">
        
        {/* 1. Logo at the top and center */}
        <a href="/" className="signup-logo">
          <img src={logoImg} alt="Gym Rat" className="signup-logo-img" />
          <div className="logo-text-wrapper">
            <div className="signup-logo-text">GYMRAT</div>
            <div className="signup-logo-sub">MARKETPLACE</div>
          </div>
        </a>

        {/* 2. The Main Card */}
        <div className="signin-card">
          <div className="signin-card-header">
            <div className="signin-badge">WELCOME BACK</div>
            <h1 className="signin-title">SIGN IN TO YOUR <span>ACCOUNT</span></h1>
            <p className="signin-subtitle">Access your orders, wishlist and community</p>
          </div>

          <div className="signin-form">
            <div className="signin-field">
              <label>Email Address</label>
              <input type="email" placeholder="you@GYMRAT.com" />
            </div>
            
            <div className="signin-field">
              <label>Password</label>
              <input type="password" placeholder="••••••••" />
            </div>

            <div className="signin-options">
              <label className="signin-remember">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
            </div>

            <div className="signin-divider">
              <span>OR CONTINUE WITH</span>
            </div>

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
          </div>
        </div>

        {/* 3. Footer below the card */}
        <div className="signin-footer">
          Don't have an account?
          <a href="/signup">Create one free →</a>
        </div>

      </div>
    </div>
  );
}