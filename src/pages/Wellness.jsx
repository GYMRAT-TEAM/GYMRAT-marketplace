import './Wellness.css';

const cards = [
  { icon: '💪', name: 'PHYSICAL', desc: 'Strength, endurance, and body composition. Products and programs to optimize your physical performance.' },
  { icon: '🧠', name: 'MENTAL', desc: 'Mindfulness, focus, and cognitive performance. Train your mind as hard as your body.' },
  { icon: '🌿', name: 'ENVIRONMENTAL', desc: 'Sustainable products and eco-conscious brands that support your health and the planet\'s.' },
  { icon: '🤝', name: 'SOCIAL', desc: 'Join challenges, find training partners, and build connections in our fitness community.' },
];

const hubs = [
  { icon: '🥗', name: 'NUTRITION PLANNER', desc: 'Macro tracking, meal plans, and supplement stacks tailored to your goals.' },
  { icon: '😴', name: 'RECOVERY ZONE', desc: 'Sleep optimization, stretching guides, and recovery gear to come back stronger.' },
  { icon: '🏃', name: 'CARDIO HUB', desc: 'Running programs, cycling gear, and endurance nutrition — all in one place.' },
];

export default function Wellness() {
  return (
    <section id="wellness">
      <div className="section-label">Holistic Health</div>
      <h2 className="section-title">YOUR <em>WELLNESS</em> HUB</h2>
      <p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '0.8rem', maxWidth: '600px' }}>
        We go beyond products. Our wellness ecosystem supports every dimension of your health journey.
      </p>
      <div className="wellness-grid">
        {cards.map(c => (
          <div className="wellness-card" key={c.name}>
            <div className="wellness-icon">{c.icon}</div>
            <div className="wellness-name">{c.name}</div>
            <div className="wellness-desc">{c.desc}</div>
          </div>
        ))}
      </div>
      <div className="hub-grid" style={{ marginTop: '3rem' }}>
        {hubs.map(h => (
          <div className="hub-card" key={h.name}>
            <div className="hub-icon">{h.icon}</div>
            <div>
              <div className="hub-name">{h.name}</div>
              <div className="hub-desc">{h.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}