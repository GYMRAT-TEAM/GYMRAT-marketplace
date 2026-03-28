import './Categories.css';

const cats = [
  { img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80', tag: 'Most Popular', name: 'GYM & TRAINING', count: '0 products', featured: true },
  { img: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&q=80', tag: 'Aquatic', name: 'SWIMMING', count: '0 products' },
  { img: 'https://i.pinimg.com/736x/40/67/f8/4067f8f1eab1986871c969ea05a3109a.jpg', tag: 'Court Sports', name: 'BASKETBALL', count: '0 products' },
  { img: 'https://i.pinimg.com/1200x/df/5c/97/df5c97b7fa7dcfb6418b98b411018f2c.jpg', tag: 'Team Sports', name: 'FOOTBALL', count: '0 products' },
  { img: 'https://i.pinimg.com/1200x/e1/19/91/e11991a48ed4bbd1e0dea0bd6e1f5f8d.jpg', tag: 'Mind & Body', name: 'PILATES', count: '0 products' },
   { img: 'https://i.pinimg.com/736x/f6/4d/e0/f64de0e51b26b3843bfbea241b126118.jpg', tag: 'Strength, Precision & Focus', name: 'Boxing', count: '0 products' },
   { img: 'https://i.pinimg.com/1200x/58/8b/5c/588b5cf44942b1b1fddd5e55942ac42a.jpg', tag: 'Control, Speed & Reflexes', name: 'Tennis', count: '0 products' },
   { img: 'https://i.pinimg.com/736x/88/43/ca/8843ca121254e3131839adf6a859dc23.jpg', tag: 'Pedal, Power & Endorphins', name: 'Cycling', count: '0 products' },
   { img: 'https://i.pinimg.com/1200x/2a/b9/a2/2ab9a26df93e15138de1157bb21ac4d5.jpg', tag: 'Coordination, Teamwork & Agility', name: 'Volleyball', count: '0 products' },
  
 
  
   
];

export default function Categories() {
  return (
    <section id="categories">
      <div className="section-label">Explore</div>
      <h2 className="section-title">BROWSE BY <em>SPORT</em></h2>
      <div className="cats-grid">
        {cats.map((cat) => (
          <a href="#products" className={`cat-card${cat.featured ? ' featured' : ''}`} key={cat.name}>
            <img
              src={cat.img}
              alt={cat.name}
              className="cat-img"
              style={cat.featured ? { height: '100%', minHeight: '420px', objectFit: 'cover' } : {}}
            />
            <div className="cat-overlay">
              <div className="cat-tag">{cat.tag}</div>
              <div className="cat-name">{cat.name}</div>
              <div className="cat-count">{cat.count}</div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}