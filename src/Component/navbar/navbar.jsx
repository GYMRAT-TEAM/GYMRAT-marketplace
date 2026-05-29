import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import GymRatBadge from '../Common/GymRatBadge';
import logoImg from '../Assets/logo.png';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Shop', href: '#products' },
  { label: 'Categories', href: '#categories' },
  { label: 'Brands', href: '#brands' },
  { label: 'Wellness', href: '#wellness' },
  { label: 'Blog', href: '#blog' },
  { label: 'Community', href: '#community' },
  { label: 'Contact', href: '#contact' },
  { label: 'App', href: '#app' },
];

export default function Navbar({ onCartClick }) {
  const { cartCount } = useCart();
  const { user, isAuthenticated, logout, isAdmin, isPremium } = useAuth();
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const [searchQuery, setSearchQuery] = useState('');
  const [active, setActive] = useState('home');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      let current = '';
      sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 100) current = s.id;
      });
      setActive(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotifClick = (notif) => {
    markRead(notif.id);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setTimeout(() => {
        document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <nav>
      <a href="#home" className="nav-logo">
        <img src={logoImg} alt="Gym Rat Marketplace" className="main-nav-logo" />
      </a>

      {/* Hamburger Toggle Button for Mobile */}
      <button
        className={`nav-hamburger ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>

      <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        {navLinks.map(link => (
          <li key={link.href}>
            <a
              href={link.href}
              className={active === link.href.replace('#', '') ? 'active' : ''}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="nav-actions">
        <input 
          type="text" 
          className="nav-search" 
          placeholder="Search products..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
        />

        {/* Premium Create Button */}
        {isAuthenticated && (isAdmin || isPremium) && (
          <button className="btn-create" onClick={() => navigate('/admin/products')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="create-icon">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Create</span>
          </button>
        )}

        {/* ── NOTIFICATIONS ── */}
        {isAuthenticated && (
          <div className="notif-wrap" ref={notifRef}>
            <button
              className={`btn-notifications ${notifOpen ? 'active' : ''}`}
              onClick={() => setNotifOpen(o => !o)}
              aria-label="Notifications"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="nav-icon">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 01-3.46 0"></path>
              </svg>
              {unreadCount > 0 && (
                <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
              )}
            </button>

            {notifOpen && (
              <div className="notif-dropdown">
                {/* Header */}
                <div className="notif-header">
                  <span className="notif-title">Notifications</span>
                  {unreadCount > 0 && (
                    <button className="notif-mark-all" onClick={markAllRead}>
                      Mark all read
                    </button>
                  )}
                </div>

                {/* Tabs */}
                <div className="notif-tabs">
                  <span className="notif-tab active">All</span>
                  <span className="notif-tab-badge">{unreadCount} new</span>
                </div>

                {/* List */}
                <div className="notif-list">
                  {notifications.map(notif => (
                    <div
                      key={notif.id}
                      className={`notif-item ${notif.read ? 'read' : 'unread'}`}
                      onClick={() => handleNotifClick(notif)}
                    >
                      <div className="notif-icon-wrap">
                        <span className="notif-emoji">{notif.icon}</span>
                        {!notif.read && <span className="notif-dot" />}
                      </div>
                      <div className="notif-content">
                        <div className="notif-item-title">{notif.title}</div>
                        <div className="notif-item-body">{notif.body}</div>
                        <div className="notif-item-time">{notif.time}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="notif-footer">
                  <button className="notif-see-all">View All Notifications →</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Auth Section */}
        {isAuthenticated ? (
          <div className="nav-profile" ref={dropdownRef}>
            <div
              className="profile-circle"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {user?.avatar ? (
                <img src={user.avatar} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <span className="profile-initials" style={{ fontSize: '18px', fontWeight: 'bold' }}>
                  {user?.firstName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'G'}
                </span>
              )}
              {(isAdmin || isPremium) && (
                <GymRatBadge
                  size={18}
                  className="admin-badge-icon"
                  variant={isAdmin ? 'superadmin' : 'premium'}
                />
              )}
            </div>

            {dropdownOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-user-info">
                  <div className="user-avatar-initials">
                    {user?.email?.charAt(0).toUpperCase() || 'G'}
                  </div>
                  <div className="user-text-info">
                    <span className="user-display-email">{user?.email}</span>
                    <span className="user-display-plan">{isAdmin ? 'SUPER ADMIN' : `${user?.plan || 'Free'} Plan`}</span>
                  </div>
                </div>

                <div className="dropdown-divider"></div>

                <div className="dropdown-body">
                  <button onClick={() => { setDropdownOpen(false); navigate('/settings'); }}>
                    <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.1a2 2 0 01-1-1.72v-.51a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    Settings
                  </button>

                  {(isAdmin || isPremium) && (
                    <button onClick={() => { setDropdownOpen(false); navigate('/admin'); }} className="admin-menu-item">
                      <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                      Admin Panel
                    </button>
                  )}

                  <div className="dropdown-divider"></div>

                  <button onClick={() => { logout(); setDropdownOpen(false); navigate('/'); }} className="dropdown-logout">
                    <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                    </svg>
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button className="btn-signin-nav" onClick={() => navigate('/signin')}>
            Sign In
          </button>
        )}

        {/* Cart */}
        <button className="btn-cart" onClick={onCartClick}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
          Cart
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
      </div>
    </nav>
  );
}