import { useNavigate } from 'react-router-dom';
import './Categories.css';

const cats = [
  { img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80', tag: 'Most Popular', name: 'GYM & TRAINING', slug: 'gym', featured: true },
  { img: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&q=80', tag: 'Aquatic', name: 'SWIMMING', slug: 'swimming' },
  { img: 'https://i.pinimg.com/736x/40/67/f8/4067f8f1eab1986871c969ea05a3109a.jpg', tag: 'Court Sports', name: 'BASKETBALL', slug: 'basketball' },
  { img: 'https://i.pinimg.com/1200x/df/5c/97/df5c97b7fa7dcfb6418b98b411018f2c.jpg', tag: 'Team Sports', name: 'FOOTBALL', slug: 'football' },
  { img: 'https://i.pinimg.com/1200x/e1/19/91/e11991a48ed4bbd1e0dea0bd6e1f5f8d.jpg', tag: 'Mind & Body', name: 'PILATES', slug: 'pilates' },
  { img: 'https://i.pinimg.com/736x/f6/4d/e0/f64de0e51b26b3843bfbea241b126118.jpg', tag: 'Strength, Precision & Focus', name: 'BOXING', slug: 'boxing' },
  { img: 'https://i.pinimg.com/1200x/58/8b/5c/588b5cf44942b1b1fddd5e55942ac42a.jpg', tag: 'Control, Speed & Reflexes', name: 'TENNIS', slug: 'tennis' },
  { img: 'https://i.pinimg.com/736x/88/43/ca/8843ca121254e3131839adf6a859dc23.jpg', tag: 'Pedal, Power & Endorphins', name: 'CYCLING', slug: 'cycling' },
  { img: 'https://i.pinimg.com/1200x/2a/b9/a2/2ab9a26df93e15138de1157bb21ac4d5.jpg', tag: 'Coordination, Teamwork & Agility', name: 'VOLLEYBALL', slug: 'volleyball' },
];

export default function Categories() {
  const navigate = useNavigate();

  return (
    <section id="categories">
      <div className="section-label">Explore</div>
      <h2 className="section-title">BROWSE BY <em>SPORT</em></h2>
      <div className="cats-grid">
        {cats.map((cat) => (
          <div 
            className={`cat-card${cat.featured ? ' featured' : ''}`} 
            key={cat.name}
            onClick={() => navigate(`/shop/${cat.slug}`)}
            style={{ cursor: 'pointer' }}
          >
            <img
              src={cat.img}
              alt={cat.name}
              className="cat-img"
              style={cat.featured ? { height: '100%', minHeight: '420px', objectFit: 'cover' } : {}}
            />
            <div className="cat-overlay">
              <div className="cat-tag">{cat.tag}</div>
              <div className="cat-name">{cat.name}</div>
              <div className="cat-count">View Products →</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}