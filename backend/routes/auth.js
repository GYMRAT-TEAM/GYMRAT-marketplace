const router = require('express').Router();
const multer = require('multer');
const { register, login, getMe, logout, googleSignIn, updateProfile, uploadAvatar, upgradePlan, changePassword } = require('../controllers/authController');
const { registerRules, loginRules, handleValidation } = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');
const { protect } = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// POST /api/auth/register — rate limited + validated
router.post('/register', authLimiter, registerRules, handleValidation, register);

// POST /api/auth/login — rate limited + validated
router.post('/login', authLimiter, loginRules, handleValidation, login);

// POST /api/auth/google — rate limited
router.post('/google', authLimiter, googleSignIn);

// GET /api/auth/me — returns current user from token
router.get('/me', protect, getMe);

// PUT /api/auth/profile — updates current user profile
router.put('/profile', protect, updateProfile);

// POST /api/auth/avatar — upload profile picture (multipart/form-data, field: avatar)
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);

// PUT /api/auth/upgrade-plan — upgrade subscription plan in-place
router.put('/upgrade-plan', protect, upgradePlan);

// PUT /api/auth/password — change password (requires current password)
router.put('/password', protect, changePassword);

// POST /api/auth/logout — clears server-side session (token is cleared on client)
router.post('/logout', protect, logout);

module.exports = router;
