const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, please login.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ message: 'User not found.' });
    }
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(401).json({ message: 'Not authorized, token failed.' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'User role not authorized.' });
    }
    next();
  };
};

const requireApprovedSupplier = (req, res, next) => {
  if (req.user && req.user.role === 'supplier' && req.user.status !== 'approved') {
    return res.status(403).json({ message: 'Your supplier account is pending approval.' });
  }
  next();
};

// Allow super_admin, suppliers, OR users with business/vip plan
const requirePremiumPlan = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Not authorized.' });
  const PREMIUM_PLANS = ['business', 'vip', 'Business', 'VIP'];
  const isAdmin   = req.user.role === 'super_admin';
  const isSupplier = req.user.role === 'supplier';
  const isPremium = PREMIUM_PLANS.includes(req.user.plan);
  
  if (!isAdmin && !isSupplier && !isPremium) {
    return res.status(403).json({ message: 'Business/VIP plan or Supplier role required to add products.' });
  }
  next();
};

module.exports = { protect, authorize, requireApprovedSupplier, requirePremiumPlan };