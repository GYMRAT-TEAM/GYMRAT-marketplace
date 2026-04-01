import './Wellness.css';
import athleteImg from '../Component/Assets/atlete.png';
const features = [
  {
    icon: '',
    title: 'Modern Equipment',
    desc: 'From GYMRAT Marketplace.'
  },
  {
    icon: '',
    title: 'Body Fitness',
    desc: 'From GYMRAT APP.'
  },
];

export default function Wellness() {
  return (
    <section id="wellness">
      <div className="wl-container">

        {/* ── LEFT: red circle + athlete ── */}
        <div className="wl-visual">
          {/* dot grid top-left */}
          <div className="wl-dots">
            {[...Array(12)].map((_, i) => <span key={i} className="wl-dot" />)}
          </div>

          {/* big red circle */}
          <div className="wl-circle" />

          {/* vertical watermark */}
          <div className="wl-watermark">TRAINING</div>

          {/* squiggle */}
          <div className="wl-squiggle"></div>

          {/* athlete photo — replace src with a transparent-bg PNG for best result */}
          <img
            src={athleteImg}
            alt="Athlete"
            className="wl-athlete"
          />
        </div>
        

        {/* ── RIGHT: text content ── */}
        <div className="wl-content">
          <span className="wl-eyebrow">ABOUT GYMRAT</span>

          <h2 className="wl-title">
            We Can Give A Shape<br />Of Your Body Here!
          </h2>

          <p className="wl-body">
            Gymrat Marketplace goes beyond products. Our wellness ecosystem supports every dimension of your health journey 
             from gear to nutrition to recovery.
          </p>

          <div className="wl-features">
            {features.map(f => (
              <div className="wl-feature" key={f.title}>
                <div className="wl-feature-icon">{f.icon}</div>
                <div>
                  <div className="wl-feature-title">{f.title}</div>
                  <div className="wl-feature-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}