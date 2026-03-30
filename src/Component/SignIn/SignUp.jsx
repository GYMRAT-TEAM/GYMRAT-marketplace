import './SignUp.css';
import logoImg from '../Assets/logo.png';

const plans = [
  {
    name: 'Standard Plan',
    price: '00.00',
    popular: false,
    features: [
      'Access to all products',
      'Basic order tracking',
      'Community access',
      
    ],
  },
  {
    name: 'Business Plan',
    price: '29.99',
    popular: true,
    features: [
      'Access to all products',
      'Priority order tracking',
      'Community access',
      'Live chat support',
      'Exclusive member deals',
    ],
  },
  {
    name: 'VIP Plan',
    price: '59.99',
    popular: false,
    features: [
      'Access to all products',
      'VIP order tracking',
      'Community access',
      '24/7 dedicated support',
      'Exclusive member deals',
      'Early access to new products',
    ],
  },
];

export default function SignUp() {
  return (
    <div className="signup-page">
      <div className="signup-glow signup-glow-1"></div>
      <div className="signup-glow signup-glow-2"></div>

      <div className="signup-container">

        {/* Logo */}
        <a href="/" className="signup-logo">
          <img src={logoImg} alt="Gym Rat" className="signup-logo-img" />
          <div>
            <div className="signup-logo-text">GYMRAT</div>
            <div className="signup-logo-sub">MARKETPLACE</div>
          </div>
        </a>

        {/* Header */}
        <div className="signup-header">
          <h1 className="signup-title">No Extra Charge<br />Choose Your <span>Desire Plan</span></h1>
          <p className="signup-subtitle">Select the plan that fits your fitness journey</p>
        </div>

        {/* Plans */}
        <div className="signup-plans">
          {plans.map(plan => (
            <div className={`signup-plan-card ${plan.popular ? 'popular' : ''}`} key={plan.name}>
              {plan.popular && <div className="plan-popular-badge">Popular</div>}
              <div className="plan-name">{plan.name}</div>
              <div className="plan-price">
                <span className="plan-currency">$</span>
                {plan.price}
                <span className="plan-period">/month</span>
              </div>
              <p className="plan-desc">Full access to Gym Rat Marketplace</p>
              <ul className="plan-features">
                {plan.features.map(f => (
                  <li key={f}>
                    <span className="plan-check">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button className={`plan-btn ${plan.popular ? 'plan-btn-popular' : ''}`}>
                Select Plan
              </button>
            </div>
          ))}
        </div>

        {/* Back to signin */}
        <div className="signup-back">
          Already have an account? <a href="/signin">Sign In →</a>
        </div>

      </div>
    </div>
  );
}