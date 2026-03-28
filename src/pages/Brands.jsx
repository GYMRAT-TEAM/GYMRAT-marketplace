import './Brands.css';

export default function Brands() {
  const brands = ['NIKE','ADIDAS','UNDER ARMOUR','OPTIMUM NUTRITION','MYPROTEIN','REEBOK','PUMA','C4 SPORT','GYMSHARK','BSN'];
  const featured = [
    { name: 'NIKE', count: '143 products' },
    { name: 'ADIDAS', count: '98 products' },
    { name: 'GYMSHARK', count: '67 products' },
    { name: 'MYPROTEIN', count: '84 products' },
  ];

  return (
    <section id="brands">
      <div className="section-label">Premium Partners</div>
      <h2 className="section-title">TOP <em>BRANDS</em></h2>
      <p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '0.8rem' }}>
        Discover premium names like Nike and other leading global brands known for quality
      </p>
      <div style={{ overflow: 'hidden', marginTop: '3rem' }}>
        <div className="brands-marquee">
          {[...brands, ...brands].map((b, i) => (
            <div className="brand-logo" key={i}>{b}</div>
          ))}
        </div>
      </div>
      <div className="brands-featured">
        {featured.map(b => (
          <div className="brand-card" key={b.name}>
            <div className="brand-card-logo">{b.name}</div>
            <div className="brand-card-count">{b.count}</div>
          </div>
        ))}
      </div>
    </section>
  );
}