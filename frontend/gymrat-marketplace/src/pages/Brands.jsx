import './Brands.css';

export default function Brands() {
  const brands = ['NIKE','ADIDAS','PUMA','ALO','ZARA','FORMULA1','NEW BALANCE','Reebok','POLO','FILS'];
  const featured = [
    { name: 'NIKE', count: '0 products', img: 'https://i.pinimg.com/1200x/ed/45/2d/ed452d2d7335442e503eed35c36d0791.jpg' },
    { name: 'NEW BALANCE', count: '0 products', img: 'https://i.pinimg.com/1200x/81/48/26/814826b270e650185d4b9e11aa580569.jpg' },
    { name: 'PUMA', count: '0 products', img: 'https://i.pinimg.com/736x/67/f7/c9/67f7c990076073ad4ff91fd38c6fba91.jpg' },
    { name: 'THE NORTH FACE', count: '0 products', img: 'https://i.pinimg.com/1200x/6c/14/ee/6c14ee37c302f82bd4f0f813989611ed.jpg' },
  ];

  return (
    <section id="brands">
      <div className="section-label">Premium Partners</div>
      <h2 className="section-title">TOP <em>BRANDS</em></h2>
      <p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '0.8rem' }}>
       
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
            <img src={b.img} alt={b.name} className="brand-card-img" />
            <div className="brand-card-overlay" />
            <div className="brand-card-info">
              <div className="brand-card-logo">{b.name}</div>
              <div className="brand-card-count">{b.count}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}