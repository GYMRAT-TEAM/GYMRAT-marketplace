import React from 'react';
import './Hero.css';
// Ensure this path is correct based on your file structure
import logoImg from '../Assets/logo.png'; 

export default function Hero() {
  return (
    <section id="home">
      {/* ADDED LOGO WRAPPER */}
      <div className="hero-nav">
        <a href="/" className="hero-logo-link">
          <img src={logoImg} alt="Gym Rat Logo" className="hero-main-logo" />
        </a>
      </div>

      <div className="hero-bg"></div>
      <div className="hero-noise"></div>
      
      <div className="hero-content">
        <div className="hero-badge"><span></span> NEW COLLECTION 2026</div>
        <h1 className="hero-title">GymRat World<br /><em>Built for beasts</em></h1>
        <p className="hero-sub">
          Premium supplements and fitness gear designed for champions. Transform your body,
          elevate your performance, dominate your goals.
        </p>
        <div className="hero-btns">
          <a href="#products" className="btn-primary">SHOP NOW</a>
          <a href="#categories" className="btn-ghost">VIEW CATEGORIES</a>
        </div>
      </div>

      <div className="hero-stats">
        <div className="stat"><div className="stat-num">0+</div><div className="stat-label">Products</div></div>
        <div className="stat"><div className="stat-num">0+</div><div className="stat-label">Members</div></div>
        <div className="stat"><div className="stat-num">0+</div><div className="stat-label">Brands</div></div>
      </div>

      <div className="hero-scroll">
        <div className="scroll-line"></div>
        SCROLL
      </div>
    </section>
  );
}