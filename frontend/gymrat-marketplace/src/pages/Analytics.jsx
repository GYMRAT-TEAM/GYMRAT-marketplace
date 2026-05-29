import './Analytics.css';

const cards = [
  { label: 'Total Orders', num: '0', change: '↑ 0% this month', up: true },
  { label: 'Revenue', num: '0', change: '↑ 0% vs last month', up: true },
  { label: 'New Members', num: '0', change: '↑ 0% this week', up: true },
  { label: 'Returns Rate', num: '0', change: '↓ 0% ', up: false },
];

const barHeights = [40,55,48,70,62,80,75,90,85,95,78,100];

export default function Analytics() {
  return (
    <section id="analytics">
      <div className="section-label">Your Dashboard</div>
      <h2 className="section-title">PERFORMANCE <em>ANALYTICS</em></h2>
      <div className="analytics-grid">
        {cards.map((c, i) => (
          <div className="analytic-card" key={i}>
            <div className="analytic-label">{c.label}</div>
            <div className="analytic-num">{c.num}</div>
            <div className={`analytic-change ${c.up ? 'up' : 'down'}`}>{c.change}</div>
          </div>
        ))}
      </div>
      <div className="analytics-chart">
        {barHeights.map((h, i) => (
          <div className="chart-bar" key={i} style={{ height: h + '%' }}></div>
        ))}
      </div>
    </section>
  );
}