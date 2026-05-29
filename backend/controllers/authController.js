const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Order = require('../models/Order');
const logger = require('../utils/logger');
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const cloudinary = require('cloudinary').v2;

// Configure cloudinary (uses CLOUDINARY_* env vars automatically if set, else we skip)
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Sign a JWT containing userId + role, expires in 7 days
const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Safe user object — never includes password
const safeUser = (user) => ({
  id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.role,
  status: user.status,
  plan: user.plan,
  avatar: user.avatar || null,
  businessName: user.businessName,
  orderCount: user.orderCount || 0,
});

// POST /api/auth/register
const register = async (req, res) => {
  try {
    console.log('[SIGNUP] ---- New registration request ----');
    console.log('[SIGNUP] Request body:', JSON.stringify(req.body, null, 2));

    let {
      firstName,
      lastName,
      name,
      email,
      password,
      role = 'buyer',
      businessName,
      plan = 'standard',
      paymentMethod = 'cash_on_delivery'
    } = req.body;

    // FIX: support "name" fallback
    if (!firstName && name) {
      const parts = name.split(" ");
      firstName = parts[0];
      lastName = parts.slice(1).join(" ") || "User";
    }

    console.log('[SIGNUP] Parsed user info:', { firstName, lastName, email, plan, role, paymentMethod });

    if (!firstName || !lastName || !email || !password) {
      console.log('[SIGNUP] ERROR: Missing required fields');
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (password.length < 6) {
      console.log('[SIGNUP] ERROR: Password too short');
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      console.log('[SIGNUP] ERROR: Email already exists -', email);
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const userData = { firstName, lastName, email, password, role, plan };

    if (role === 'supplier') {
      userData.businessName = businessName;
      userData.status = 'pending';
    }

    const user = await User.create(userData);
    console.log('[SIGNUP] User created successfully:', { id: user._id, name: firstName + ' ' + lastName, email, plan });

    // Auto-create subscription order for paid plans
    if (plan === 'business' || plan === 'vip') {
      const planPrices = { 'business': 4990, 'vip': 9990 };
      const amount = planPrices[plan] || 0;

      await Order.create({
        buyer: user._id,
        items: [{
          product: user._id,
          supplier: user._id,
          title: `Subscription: ${plan} Plan`,
          price: amount,
          quantity: 1
        }],
        totalAmount: amount,
        paymentMethod: paymentMethod === 'card' ? 'card' : 'baridi_mob',
        status: 'confirmed'
      });
      console.log('[SIGNUP] Subscription order created:', { plan, amount, paymentMethod });
    }

    if (role === 'supplier') {
      console.log('[SIGNUP] Supplier account pending approval:', email);
      return res.status(201).json({
        message: 'Registration successful. Your supplier account is under review. You will be notified once approved.',
        status: 'pending',
      });
    }

    const token = generateToken(user._id, user.role);

    // Send emails based on plan
    const { sendWelcomeEmail, sendPaymentConfirmationEmail } = require('../utils/mailer');

    console.log('[EMAIL] Sending welcome email to', email, '(name:', firstName + ')');
    sendWelcomeEmail(email, firstName);

    // Only send payment confirmation for paid plans (Business / VIP)
    if (plan === 'business' || plan === 'vip') {
      const planLabels = { 'business': 'Business', 'vip': 'VIP' };
      const planPrices = { 'business': 4990, 'vip': 9990 };
      console.log('[EMAIL] Sending payment confirmation to', email, '- Plan:', planLabels[plan], '- Amount:', planPrices[plan]);
      sendPaymentConfirmationEmail(email, firstName, planLabels[plan], planPrices[plan], paymentMethod);
    } else {
      console.log('[EMAIL] Standard plan - no payment email needed');
    }

    console.log('[SIGNUP] ---- Registration complete for', email, '----');
    return res.status(201).json({ token, user: safeUser(user) });

  } catch (err) {
    console.error("[SIGNUP] ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ADDED: basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      logger.warn(`Failed login — unknown email: ${email}`);
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = user.matchPassword(password);
    if (!isMatch) {
      logger.warn(`Failed login — wrong password for: ${email}`);
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ message: 'Your account has been suspended. Contact support.' });
    }

    if (user.role === 'supplier' && user.status === 'pending') {
      return res.status(403).json({
        message: 'Your supplier account is still pending admin approval.',
        status: 'pending',
      });
    }

    const token = generateToken(user._id, user.role);
    logger.info(`User logged in: ${email} (${user.role})`);

    return res.json({ token, user: safeUser(user) });
  } catch (err) {
    console.error('CRITICAL LOGIN ERROR:', err);
    logger.error(`login error: ${err.message}`);
    return res.status(500).json({ message: 'Login failed. Please try again.' });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  return res.json(safeUser(req.user));
};

// POST /api/auth/logout  — ADDED
// Token is cleared on the frontend; this just confirms server-side
const logout = async (req, res) => {
  logger.info(`User logged out: ${req.user?.email}`);
  return res.json({ message: 'Logged out successfully.' });
};

// POST /api/auth/google
const googleSignIn = async (req, res) => {
  try {
    const { credential, plan: requestedPlan = 'standard' } = req.body;
    if (!credential) {
      return res.status(400).json({ message: 'Google credential missing.' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, given_name, family_name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      const crypto = require('crypto');
      const randomPassword = crypto.randomBytes(16).toString('hex') + 'A1!';

      user = await User.create({
        firstName: given_name || 'Gym',
        lastName: family_name || 'Rat',
        email,
        password: randomPassword,
        role: 'buyer',
        plan: requestedPlan,
        avatar: picture || null,
      });
      logger.info(`New Google user registered (${requestedPlan}): ${email}`);
      const { sendWelcomeEmail } = require('../utils/mailer');
      sendWelcomeEmail(email, user.firstName);
    } else {
      // Existing user: keep their plan unless they're upgrading via a paid plan selection
      const premiumPlans = ['business', 'vip', 'Business', 'VIP'];
      if (premiumPlans.includes(requestedPlan) && !premiumPlans.includes(user.plan)) {
        user.plan = requestedPlan;
        await user.save();
      }
      logger.info(`User logged in via Google: ${email}`);
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ message: 'Your account has been suspended.' });
    }

    const token = generateToken(user._id, user.role);
    return res.json({ token, user: safeUser(user) });
  } catch (err) {
    logger.error(`googleSignIn error: ${err.message}`);
    return res.status(500).json({ message: 'Google Sign-In failed. Please try again.' });
  }
};

// PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      gender,
      address,
      phone,
      dateOfBirth,
      location,
      postalCode
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (gender) user.gender = gender;
    if (address) user.address = address;
    if (phone) user.phone = phone;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (location) user.location = location;
    if (postalCode) user.postalCode = postalCode;

    await user.save();

    logger.info(`Profile updated for: ${user.email}`);
    return res.json({
      message: 'Profile updated successfully.',
      user: safeUser(user)
    });
  } catch (err) {
    logger.error(`updateProfile error: ${err.message}`);
    return res.status(500).json({ message: 'Failed to update profile.' });
  }
};

// POST /api/auth/avatar — upload profile picture (multipart/form-data, field: avatar)
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    let avatarUrl;

    // If Cloudinary is configured, upload there; otherwise use local fallback
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'gymrat/avatars', transformation: [{ width: 256, height: 256, crop: 'fill', gravity: 'face' }] },
          (error, result) => { if (error) reject(error); else resolve(result); }
        );
        stream.end(req.file.buffer);
      });
      avatarUrl = result.secure_url;
    } else {
      // Fallback: serve from /uploads static folder
      const fs = require('fs');
      const path = require('path');
      const uploadsDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
      const filename = `avatar_${req.user._id}_${Date.now()}${req.file.originalname.match(/\.[^.]+$/) || '.jpg'}`;
      fs.writeFileSync(path.join(uploadsDir, filename), req.file.buffer);
      avatarUrl = `/uploads/${filename}`;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarUrl },
      { new: true }
    );

    logger.info(`Avatar updated for: ${user.email}`);
    return res.json({ message: 'Avatar updated.', user: safeUser(user), avatarUrl });
  } catch (err) {
    logger.error(`uploadAvatar error: ${err.message}`);
    return res.status(500).json({ message: 'Failed to upload avatar.' });
  }
};

// PUT /api/auth/upgrade-plan — upgrade current user's subscription plan
const upgradePlan = async (req, res) => {
  try {
    const { plan, paymentMethod = 'card' } = req.body;
    // Normalise to lowercase; accept both legacy ('Business'/'VIP') and new ('business'/'vip')
    const normPlan = plan?.toLowerCase();
    const validPlans = ['standard', 'business', 'vip'];
    if (!normPlan || !validPlans.includes(normPlan)) {
      return res.status(400).json({ message: 'Invalid plan. Must be standard, business, or vip.' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { plan: normPlan },
      { new: true }
    );

    // Create subscription order record
    const planPrices = { 'business': 4990, 'vip': 9990, 'standard': 0 };
    const amount = planPrices[normPlan] || 0;
    if (amount > 0) {
      await Order.create({
        buyer: user._id,
        items: [{
          product: user._id,
          supplier: user._id,
          title: `Plan Upgrade: ${plan}`,
          price: amount,
          quantity: 1
        }],
        totalAmount: amount,
        paymentMethod: paymentMethod === 'card' ? 'card' : 'baridi_mob',
        status: 'confirmed'
      });
    }

    logger.info(`Plan upgraded to ${normPlan} for: ${user.email}`);
    return res.json({ message: `Plan upgraded to ${normPlan} successfully.`, user: safeUser(user) });
  } catch (err) {
    logger.error(`upgradePlan error: ${err.message}`);
    return res.status(500).json({ message: 'Failed to upgrade plan.' });
  }
};

// PUT /api/auth/password — change password (requires current password)
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new password are required.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters.' });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const isMatch = user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    user.password = newPassword;
    await user.save();

    logger.info(`Password changed for: ${user.email}`);
    return res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    logger.error(`changePassword error: ${err.message}`);
    return res.status(500).json({ message: 'Failed to update password.' });
  }
};

module.exports = { register, login, getMe, logout, googleSignIn, updateProfile, uploadAvatar, upgradePlan, changePassword };
