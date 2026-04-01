import './SignUp.css';
import logoImg from '../Assets/logo.png';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    name: 'Standard Plan',
    price: '00',
    popular: false,
    features: [
      'Shop everyday products without premium brands',
      'Basic order tracking',
      'Community access',
    ],
  },
  {
    name: 'Business Plan',
    price: '4990',
    popular: true,
    features: [
      'Access to all products',
      'Priority order tracking',
      'Community access',
      'Exclusive access to sale and discounted products',
      'Dedicated admin panel account',
    ],
  },
  {
    name: 'VIP Plan',
    price: '9990',
    popular: false,
    features: [
      'Access to all products',
      'VIP order tracking',
      'Community access',
      '24/7 dedicated support',
      'Exclusive access to premium brands',
      'Exclusive access to sale and discounted products',
      'Dedicated admin panel account',
    ],
  },
];

export default function SignUp() {
  const navigate = useNavigate();

  const handleSelectPlan = (plan) => {
    if (plan.name === 'Business Plan' || plan.name === 'VIP Plan') {
      navigate('/payment', { state: { plan } });
    } else {
      navigate('/create-account', { state: { plan } });
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-glow signup-glow-1" />
      <div className="signup-glow signup-glow-2" />

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
          <h1 className="signup-title">
            Unlock the best experience with our plans
            <br />
            Choose Your <span>Desire Plan</span>
          </h1>
          <p className="signup-subtitle">Select the plan that fits your fitness journey</p>
        </div>

        {/* Plans Grid */}
        <div className="signup-plans">
          {plans.map((plan) => (
            <div
              className={`signup-plan-card ${plan.popular ? 'popular' : ''}`}
              key={plan.name}
            >
              {plan.popular && <div className="plan-popular-badge">Popular</div>}
              <div className="plan-name">{plan.name}</div>
              <div className="plan-price">
                <span className="plan-currency">DZD</span>
                {plan.price}
                <span className="plan-period">/month</span>
              </div>
              <p className="plan-desc">GymRat Marketplace</p>
              <ul className="plan-features">
                {plan.features.map((f) => (
                  <li key={f}>
                    <span className="plan-check">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={`plan-btn ${plan.popular ? 'plan-btn-popular' : ''}`}
                onClick={() => handleSelectPlan(plan)}
              >
                Select Plan
              </button>
            </div>
          ))}
        </div>

        <div className="signup-back">
          Already have an account? <a href="/signin">Sign In →</a>
        </div>

      </div>
    </div>
  );
}