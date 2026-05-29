const router = require('express').Router();
const {
  getMyProducts, createProduct, updateProduct, deleteProduct,
  getMyOrders, getStats,
} = require('../controllers/supplierController');
const { protect, authorize, requireApprovedSupplier } = require('../middleware/auth');
const { productRules, handleValidation } = require('../middleware/validate');

// All supplier routes require: valid JWT + supplier role + approved status
router.use(protect, authorize('supplier'), requireApprovedSupplier);

// Analytics
router.get('/stats', getStats);

// Product catalog management
router.get('/products',     getMyProducts);
router.post('/products',    productRules, handleValidation, createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Orders received
router.get('/orders', getMyOrders);

module.exports = router;
