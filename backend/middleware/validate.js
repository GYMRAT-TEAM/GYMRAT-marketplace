const { body, validationResult } = require('express-validator');

/**
 * Collects express-validator errors and returns a 400 if any exist.
 * Always call this AFTER your validation rule arrays.
 */
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed.',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// ─── Auth Rules ───────────────────────────────────────────────────────────────

const registerRules = [
  body('firstName').trim().notEmpty().withMessage('First name is required.').isLength({ max: 50 }),
  body('lastName').trim().notEmpty().withMessage('Last name is required.').isLength({ max: 50 }),
  body('email').isEmail().withMessage('A valid email is required.').normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number.'),
  body('role')
    .optional()
    .isIn(['buyer', 'supplier'])
    .withMessage('Role must be "buyer" or "supplier".'),
  body('businessName')
    .if(body('role').equals('supplier'))
    .notEmpty()
    .withMessage('Business name is required for supplier accounts.'),
];

const loginRules = [
  body('email').isEmail().withMessage('A valid email is required.').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required.'),
];

// ─── Product Rules ────────────────────────────────────────────────────────────

const productRules = [
  body('title').trim().notEmpty().withMessage('Product title is required.').isLength({ max: 200 }),
  body('description').optional().trim().isLength({ max: 2000 }),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number.'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer.'),
  body('category')
    .isIn(['PROTEIN', 'EQUIPMENT', 'ACCESSORIES', 'APPAREL', 'SUPPLEMENTS', 'NUTRITION'])
    .withMessage('Invalid category.'),
  body('brand').optional().trim().isLength({ max: 100 }),
  body('photos').optional().isArray().withMessage('Photos must be an array of URLs.'),
];

// ─── Order Rules ──────────────────────────────────────────────────────────────

const orderRules = [
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item.'),
  body('items.*.productId').notEmpty().withMessage('Each item must have a product ID.'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1.'),
  body('shippingAddress.fullName').notEmpty().withMessage('Full name is required.'),
  body('shippingAddress.address').notEmpty().withMessage('Address is required.'),
  body('shippingAddress.city').notEmpty().withMessage('City is required.'),
  body('shippingAddress.phone')
    .notEmpty()
    .withMessage('Phone number is required.')
    .isMobilePhone().withMessage('Invalid phone number.'),
  body('paymentMethod')
    .isIn(['card', 'baridi_mob', 'cash_on_delivery'])
    .withMessage('Invalid payment method.'),
];

module.exports = { handleValidation, registerRules, loginRules, productRules, orderRules };
