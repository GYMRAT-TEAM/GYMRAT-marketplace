const router = require('express').Router();
const {
  getDashboardStats,
  getUsers, approveUser, suspendUser,
  getProducts, approveProduct, rejectProduct, addProduct, deleteProduct,
  getOrders,
} = require('../controllers/adminController');
const { protect, authorize, requirePremiumPlan } = require('../middleware/auth');

// Dashboard stats — public for now (no auth required)
router.get('/dashboard-stats', getDashboardStats);

// ── Product management — accessible by super_admin OR business/vip users ───────
router.get('/products',             protect, authorize('super_admin'), getProducts);
router.post('/products',            protect, requirePremiumPlan,       addProduct);
router.put('/products/:id/approve', protect, authorize('super_admin'), approveProduct);
router.put('/products/:id/reject',  protect, authorize('super_admin'), rejectProduct);
router.delete('/products/:id',      protect, requirePremiumPlan,       deleteProduct);

// ── Super-admin only routes ─────────────────────────────────────────────────────
router.use(protect, authorize('super_admin'));

// User management
router.get('/users',             getUsers);
router.put('/users/:id/approve', approveUser);
router.put('/users/:id/suspend', suspendUser);

// Orders overview
router.get('/orders', getOrders);

module.exports = router;
