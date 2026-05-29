import React from 'react';
import './Footer.css';
import logoImg from '../Assets/logo.png';

export default function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div>
          <a href="#home" className="footer-logo-link">
            <img src={logoImg} alt="Gym Rat Logo" className="footer-main-logo" />
          </a>
          <p className="footer-about-text">
            Your ultimate destination for premium fitness products, supplements, and gear. Built for athletes, by athletes. Transform your body, elevate your performance.
          </p>
        </div>

        <div>
          <div className="footer-h">Shop</div>
          <ul className="footer-links">
            {['Supplements', 'Equipment', 'Apparel', 'Shoes', 'Accessories'].map(l => (
              <li key={l}><a href="#products">{l}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <div className="footer-h">Company</div>
          <ul className="footer-links">
            {['About Us', 'Careers', 'Press', 'Affiliates', 'Blog'].map(l => (
              <li key={l}><a href="#blog">{l}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <div className="footer-h">Support</div>
          <ul className="footer-links">
            {['FAQ', 'Shipping', 'Returns', 'Track Order', 'Contact'].map(l => (
              <li key={l}><a href="#contact">{l}</a></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-copy">© 2026 Gym Rat Marketplace. All rights reserved.</div>
        <div className="social-links">
          {['IG', 'TW', 'YT', 'TK'].map(s => (
            <a href="/" className="social-link" key={s}>{s}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}