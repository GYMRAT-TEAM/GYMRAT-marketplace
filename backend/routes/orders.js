const router = require('express').Router();
const { createOrder, createCartOrder, getMyOrders, getOrderById } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');
const { orderRules, handleValidation } = require('../middleware/validate');

// All order routes require authentication
router.use(protect);

// POST /api/orders/cart — checkout from cart (flexible, no productId required)
router.post('/cart', createCartOrder);

// POST /api/orders — buyer places a standard order
router.post('/', authorize('buyer'), orderRules, handleValidation, createOrder);

// GET /api/orders/my — buyer sees their order history
// NOTE: /my must be defined BEFORE /:id to avoid route collision
router.get('/my', getMyOrders);

// GET /api/orders/:id — buyer or admin sees a specific order
router.get('/:id', getOrderById);

module.exports = router;
