import { useParams, useNavigate } from 'react-router-dom';
import Products from './Products';
import './SportShop.css';

// Map URL slug → display name & sport filter key used in Products data
const SPORT_META = {
  gym:        { label: 'GYM & TRAINING',          sport: 'Gym',         emoji: '', color: '#730c1e', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=80' },
  swimming:   { label: 'SWIMMING',                sport: 'Swimming',    emoji: '', color: '#2980b9', img: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1200&q=80' },
  basketball: { label: 'BASKETBALL',              sport: 'Basketball',  emoji: '', color: '#f39c12', img: 'https://i.pinimg.com/736x/40/67/f8/4067f8f1eab1986871c969ea05a3109a.jpg' },
  football:   { label: 'FOOTBALL',                sport: 'Football',    emoji: '', color: '#27ae60', img: 'https://i.pinimg.com/1200x/df/5c/97/df5c97b7fa7dcfb6418b98b411018f2c.jpg' },
  pilates:    { label: 'PILATES',                 sport: 'Pilates',     emoji: '', color: '#9b59b6', img: 'https://i.pinimg.com/1200x/e1/19/91/e11991a48ed4bbd1e0dea0bd6e1f5f8d.jpg' },
  boxing:     { label: 'BOXING',                  sport: 'Boxing',      emoji: '', color: '#c0392b', img: 'https://i.pinimg.com/736x/f6/4d/e0/f64de0e51b26b3843bfbea241b126118.jpg' },
  tennis:     { label: 'TENNIS',                  sport: 'Tennis',      emoji: '', color: '#27ae60', img: 'https://i.pinimg.com/1200x/58/8b/5c/588b5cf44942b1b1fddd5e55942ac42a.jpg' },
  cycling:    { label: 'CYCLING',                 sport: 'Cycling',     emoji: '', color: '#2980b9', img: 'https://i.pinimg.com/736x/88/43/ca/8843ca121254e3131839adf6a859dc23.jpg' },
  volleyball: { label: 'VOLLEYBALL',              sport: 'Volleyball',  emoji: '', color: '#f39c12', img: 'https://i.pinimg.com/1200x/2a/b9/a2/2ab9a26df93e15138de1157bb21ac4d5.jpg' },
};

export default function SportShop() {
  const { sport } = useParams();
  const navigate = useNavigate();
  const meta = SPORT_META[sport] || { label: sport?.toUpperCase(), sport: sport, emoji: '', color: '#730c1e', img: '' };

  return (
    <div className="sport-shop-page">
      {/* Hero Banner */}
      <div className="sport-hero" style={{ backgroundImage: `url(${meta.img})` }}>
        <div className="sport-hero-overlay" style={{ background: `linear-gradient(135deg, ${meta.color}cc 0%, rgba(0,0,0,0.85) 100%)` }} />
        <div className="sport-hero-content">
          <button className="sport-back-btn" onClick={() => navigate(-1)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Back to Categories
          </button>
          {meta.emoji && <div className="sport-hero-emoji">{meta.emoji}</div>}
          <h1 className="sport-hero-title">{meta.label}</h1>
          <p className="sport-hero-sub">All products for {meta.label.toLowerCase()} enthusiasts</p>
        </div>
      </div>

      {/* Products filtered by this sport */}
      <Products filterSport={meta.sport} />
    </div>
  );
}
