import React from 'react';
import './AppSection.css';
// Ensure this path matches your folder structure: src/Component/Assets/logo.png
import logo from '../Component/Assets/logo.png'; 

const features = [
  { icon: '🛒', title: 'One-Tap Shopping', desc: 'Reorder your favorites instantly. Smart recommendations based on your goals and history.' },
  { icon: '📊', title: 'Workout & Progress Tracker', desc: 'Log sets, reps, and weight. Visualize your gains with charts and weekly summaries.' },
  { icon: '🔔', title: 'Smart Notifications', desc: 'Flash sale alerts, restock reminders, and personalized deal drops — never miss a deal.' },
  { icon: '🗺️', title: 'Gym Finder with Map', desc: 'Locate partner gyms near you and unlock exclusive member-only discounts in-app.' },
];

export default function AppSection() {
  return (
    <section id="app">
      {/* --- ADDED NAV SECTION FOR LOGO --- */}
      <nav className="app-nav">
        <a href="/">
          <img src={logo} alt="Gym Rat Logo" className="main-logo" />
        </a>
      </nav>
      {/* ---------------------------------- */}

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="section-label">Download Now</div>
        <h2 className="section-title">THE GYM RAT <em>APP</em></h2>
      </div>

      <div className="app-layout">
        <div className="app-content">
          <p className="app-tagline">YOUR GYM IN<br />YOUR <em>POCKET</em></p>
          <p className="app-desc">
            Shop, track, connect — the full Gym Rat experience, now optimized for mobile. Order supplements,
            log workouts, find partner gyms, and stay connected with 50K+ athletes. All in one place, always with you.
          </p>

          <div className="app-features">
            {features.map(f => (
              <div className="app-feature" key={f.title}>
                <div className="app-feature-icon">{f.icon}</div>
                <div className="app-feature-text">
                  <div className="app-feature-title">{f.title}</div>
                  <div className="app-feature-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="app-download-row">
            <a href="#" className="app-store-btn">
              <span className="app-store-icon">🍎</span>
              <div>
                <div className="app-store-label">Download on the</div>
                <div className="app-store-name">App Store</div>
              </div>
            </a>
            <a href="#" className="app-store-btn">
              <span className="app-store-icon">▶</span>
              <div>
                <div className="app-store-label">Get it on</div>
                <div className="app-store-name">Google Play</div>
              </div>
            </a>
          </div>

          <div className="app-rating">
            <span className="app-stars">★★★★★</span>
            <span className="app-rating-text"><strong>4.9 / 5</strong> · 12,400+ ratings · Free to download</span>
          </div>
        </div>

        {/* MOCKUP SECTION */}
        <div className="app-mockup-wrap">
          <div className="app-glow"></div>

          <div className="app-notif-bubble">
            <div className="bubble-header">
              <div className="bubble-icon">🔥</div>
              <div>
                <div className="bubble-title">Flash Sale!</div>
                <div className="bubble-time">just now</div>
              </div>
            </div>
            <div className="bubble-msg">C4 Pre-Workout — 30% off for the next 2 hours only</div>
          </div>

          <div className="app-notif-bubble2">
            <div className="bubble2-num">72%</div>
            <div className="bubble2-label">Weekly Goal Progress</div>
            <div className="bubble2-bar"><div className="bubble2-bar-fill"></div></div>
          </div>

          <div className="app-phone">
            <div className="phone-notch"></div>
            <div className="phone-screen">
              <div className="phone-statusbar">
                <span>9:41</span><span>●●● 5G 100%</span>
              </div>
              <div className="phone-header">
                <div className="phone-logo">
                  <div className="phone-logo-icon">GR</div>
                  <span className="phone-logo-text">GYM RAT</span>
                </div>
                <div className="phone-notif-dot"></div>
              </div>
              <div className="phone-banner">
                <div className="phone-banner-label">Today's Goal</div>
                <div className="phone-banner-title">CHEST DAY 💪<br />PROTEIN: 180G</div>
                <div className="phone-banner-sub">6 items left on your list</div>
              </div>
              <div className="phone-stats-row">
                <div className="phone-stat-pill"><div className="phone-stat-num">3</div><div className="phone-stat-lbl">Orders</div></div>
                <div className="phone-stat-pill"><div className="phone-stat-num">12K</div><div className="phone-stat-lbl">Steps</div></div>
                <div className="phone-stat-pill"><div className="phone-stat-num">142</div><div className="phone-stat-lbl">Points</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}