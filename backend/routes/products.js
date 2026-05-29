const router = require('express').Router();
const { getProducts, getProduct } = require('../controllers/productController');

// Public routes — no auth required for the marketplace storefront
router.get('/',    getProducts);
router.get('/:id', getProduct);

module.exports = router;