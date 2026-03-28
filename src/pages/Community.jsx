import './Community.css';

const posts = [
  { initials: '', name: 'Your Feedback', text: '', likes: 0, comments: 0, time: '' },
  { initials: '', name: 'Your Feedback', text: '', likes: 0, comments: 0, time: '' },
  { initials: '', name: 'Your Feedback', text: '', likes: 0, comments: 0, time: '' },
  { initials: '', name: 'Your Feedback', text: '', likes: 0, comments: 0, time: '' },
];

export default function Community() {
  return (
    <section id="community">
      <div className="section-label">Join the Movement</div>
      <h2 className="section-title">OUR <em>COMMUNITY</em></h2>
      <div className="community-layout">
        <div className="community-feed">
          {posts.map((p, i) => (
            <div className="community-post" key={i}>
              <div className="post-avatar">{p.initials}</div>
              <div style={{ flex: 1 }}>
                <div className="post-name">{p.name}</div>
                <div className="post-text">{p.text}</div>
                <div className="post-meta">
                  <span className="post-action">♡ {p.likes}</span>
                  <span className="post-action">💬 {p.comments}</span>
                  <span>{p.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="community-stats">
          <div className="community-stat-card">
            <div className="cstat-num">0</div>
            <div className="cstat-label">Active members in the Gym Rat community</div>
          </div>
          <div className="community-stat-card">
            <div className="cstat-num">0</div>
            <div className="cstat-label">Workouts logged this week by our members</div>
          </div>
          <div className="cta-box">
            <h3>FIND YOUR FIT CREW</h3>
            <p>Connect with athletes, share your progress, and get exclusive member deals.</p>
            <a href="#contact" className="btn-white">GET STARTED FREE</a>
          </div>
        </div>
      </div>
    </section>
  );
}