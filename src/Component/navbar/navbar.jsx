import { useState, useEffect } from 'react';
import './Navbar.css';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
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
  { label: '📱 App', href: '#app' },
];

export default function Navbar() {
  const { cartCount } = useCart();
  const [active, setActive] = useState('home');
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

  return (
    <nav>
      <a href="#home" className="nav-logo">
        <img src={logoImg} alt="GymRat" className="main-nav-logo" />
      </a>
      <ul className="nav-links">
        {navLinks.map(link => (
          <li key={link.href}>
            <a href={link.href} className={active === link.href.replace('#', '') ? 'active' : ''}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      <div className="nav-actions">
        <input type="text" className="nav-search" placeholder="Search products..." />
        <button className="btn-signin" onClick={() => navigate('/signin')}>
          SIGN IN
        </button>
        <button className="btn-cart">
          🛒 Cart <span className="cart-badge">{cartCount}</span>
        </button>
      </div>
    </nav>
  );
}