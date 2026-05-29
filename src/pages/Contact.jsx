import './Contact.css';

export default function Contact() {
  return (
    <section id="contact">
      <div className="section-label">Get In Touch</div>
      <h2 className="section-title">CONTACT <em>US</em></h2>
<div className="contact-layout">
  <div>
    <div className="contact-info-item">
      <div className="contact-icon">🏢</div>
      <div>
        <div className="contact-info-label">Address</div>
        <div className="contact-info-val">Online workouts now, local workouts soon stay fit with us!</div>
      </div>
    </div>
    <div className="contact-info-item">
      <div className="contact-icon">📞</div>
      <div>
        <div className="contact-info-label">Phone</div>
        <div className="contact-info-val">Our mobile contact is coming soon stay tuned!</div>
      </div>
    </div>
          <div className="contact-info-item">
            <div className="contact-icon">📨</div>
            <div>
              <div className="contact-info-label">Email</div>
              <div className="contact-info-val">marketplace@gymrat.dz</div>
            </div>
          </div>
          <div className="contact-info-item">
            <div className="contact-icon">🌐</div>
            <div>
              <div className="contact-info-label">Join Us Online!</div>
              <div className="contact-info-val">Follow, Like, Sweat!</div>
            </div>
          </div>
        </div>

        <div className="contact-form">
          <div className="form-row">
            <input type="text" className="form-input" placeholder="First Name" />
            <input type="text" className="form-input" placeholder="Last Name" />
          </div>
          <input type="email" className="form-input" placeholder="Email Address" />
          <select className="form-select">
            <option>Order Support</option>
            <option>Product Question</option>
            <option>Partnership</option>
            <option>Other</option>
          </select>
          <textarea className="form-textarea" placeholder="Your message..."></textarea>
          <button className="btn-primary" style={{ width: '100%', border: 'none' }}>SEND MESSAGE</button>
        </div>
      </div>
    </section>
  );
}