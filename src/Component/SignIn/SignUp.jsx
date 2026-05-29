import './SignUp.css';
import logoImg from '../Assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const plans = [
  {
    name: 'Standard Plan',
    price: '00',
    planKey: 'standard',
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
    planKey: 'business',
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
    planKey: 'vip',
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
  const { loginWithGoogle } = useAuth();

  // ── Regular plan selection (email/password flow)
  const handleSelectPlan = (plan) => {
    if (plan.planKey === 'business' || plan.planKey === 'vip') {
      // Paid plans → go to payment first, then create account
      navigate('/payment', { state: { plan } });
    } else {
      // Standard (free) → go directly to create account
      navigate('/create-account', { state: { plan } });
    }
  };

  // ── Google sign-in: signs up with Standard plan by default
  // If user wants Business/VIP with Google, they select plan first then Google button appears
  const handleGoogleSuccess = async (credentialResponse, planKey = 'standard') => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credential: credentialResponse.credential,
          plan: planKey,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        loginWithGoogle(data.user, data.token);
        // Redirect based on role
        if (data.user.role === 'super_admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        alert(data.message || 'Google Sign-In failed.');
      }
    } catch (err) {
      console.error('Google sign-in failed:', err);
      alert('Google Sign-In failed. Please try again.');
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

              {/* Email/Password plan button */}
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