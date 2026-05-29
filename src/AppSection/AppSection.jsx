import React from 'react';
import './AppSection.css';
import logo from '../Component/Assets/logo.png';
import runner from '../Component/Assets/runner.png';

const features = [
  { icon: '', title: 'One-Tap Shopping',           desc: 'Reorder your favorites instantly. Smart recommendations based on your goals and history.' },
  { icon: '', title: 'Workout & Progress Tracker',  desc: 'Log sets, reps, and weight. Visualize your gains with charts and weekly summaries.' },
  { icon: '', title: 'Smart Notifications',         desc: 'Flash sale alerts, restock reminders, and personalized deal drops — never miss a deal.' },
  { icon: '', title: 'Gym Finder with Map',         desc: 'Locate partner gyms near you and unlock exclusive member-only discounts in-app.' },
];

export default function AppSection() {
  return (
    <section id="app">
      <div className="app-bg-glow" />

      <div className="app-layout">

        {/* ── LEFT: TEXT ── */}
        <div className="app-content">
          <div className="app-eyebrow">Download Now</div>

          <h2 className="app-heading">
            THE GYMRAT <em>APP</em><br />
            YOUR GYM IN<br />
            YOUR <em>POCKET</em>
          </h2>

          <p className="app-desc">
            Shop, track, connect  the full Gym Rat experience, now optimized for mobile.
            Order supplements, log workouts, find partner gyms, and stay connected with
            50K+ athletes. All in one place, always with you.
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
              <span className="app-store-icon"></span>
              <div>
                <div className="app-store-label">Download on the</div>
                <div className="app-store-name">App Store</div>
              </div>
            </a>
            <a href="#" className="app-store-btn">
              <span className="app-store-icon"></span>
              <div>
                <div className="app-store-label">Get it on</div>
                <div className="app-store-name">Google Play</div>
              </div>
            </a>
          </div>

          <div className="app-rating">
            <span className="app-stars"></span>
            <span className="app-rating-text"><strong></strong>  Free to download</span>
          </div>
        </div>

        {/* ── RIGHT: PHONE MOCKUP ── */}
        <div className="app-mockup-wrap">

          {/* Floating notification */}
         
            

          {/* Floating progress card */}
          <div className="app-progress-bubble">
            <div className="progress-pct">80%</div>
            <div className="progress-label">Weekly Goal<br />Progress</div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" />
            </div>
          </div>

          {/* Phone frame */}
          <div className="app-phone">

            {/* Notch */}
            <div className="phone-notch" />

            {/* Status bar */}
            <div className="phone-statusbar">
              <span></span>
              <span> </span>
            </div>

            {/* App header */}
            <div className="phone-header">
              <div className="phone-logo-row">
                <img src={logo} alt="GymRat" className="phone-logo-img" />
                <span className="phone-brand">GYMRAT</span>
              </div>
              <span className="phone-header-icon">🛒</span>
            </div>

            {/* ── RUNNER IMAGE fills the phone screen ── */}
            <div className="phone-screen-img-wrap">
              {/* Red circle behind athlete */}
            
              {/* Athlete image */}
              <img src={runner} alt="Athlete" className="phone-runner-img" />
              {/* Gradient overlay at bottom */}
              <div className="phone-screen-overlay" />
              {/* Text on top of image */}
            
            </div>

            {/* Stats bar at bottom of phone */}
            

          </div>{/* end phone */}
        </div>{/* end mockup-wrap */}
      </div>
    </section>
  );
}