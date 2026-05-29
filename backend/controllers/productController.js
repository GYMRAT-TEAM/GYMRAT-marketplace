const Product = require('../models/Product');
const logger  = require('../utils/logger');

// ─── GET /api/products ────────────────────────────────────────────────────────
// Public — returns all approved products with filters and pagination
const getProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, brand, sort, page = 1, limit = 20 } = req.query;

    const filter = { status: 'approved' };

    if (category) filter.type = category; // Type is used as category in database
    if (brand)    filter.brand = new RegExp(brand, 'i');
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const sortMap = {
      newest:     { createdAt: -1 },
      price_asc:  { price:  1 },
      price_desc: { price: -1 },
      rating:     { rating: -1 },
    };
    const sortBy = sortMap[sort] || { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(Number(limit))
        .populate('supplier', 'firstName lastName businessName'),
      Product.countDocuments(filter),
    ]);

    return res.json({
      products,
      total,
      page:  Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    logger.error(`getProducts error: ${err.message}`);
    return res.status(500).json({ message: 'Failed to fetch products.' });
  }
};

// ─── GET /api/products/:id ────────────────────────────────────────────────────
// Public — single approved product
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'supplier',
      'firstName lastName businessName'
    );

    if (!product || product.status !== 'approved') {
      return res.status(404).json({ message: 'Product not found.' });
    }

    return res.json(product);
  } catch (err) {
    logger.error(`getProduct error: ${err.message}`);
    return res.status(500).json({ message: 'Failed to fetch product.' });
  }
};

module.exports = { getProducts, getProduct };