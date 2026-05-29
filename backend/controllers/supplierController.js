const Product = require('../models/Product');
const Order   = require('../models/Order');
const logger  = require('../utils/logger');

// ─── GET /api/supplier/products ───────────────────────────────────────────────
const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ supplier: req.user._id }).sort({ createdAt: -1 });
    return res.json(products);
  } catch (err) {
    logger.error(`supplier.getMyProducts error: ${err.message}`);
    return res.status(500).json({ message: 'Failed to fetch your products.' });
  }
};

// ─── POST /api/supplier/products ──────────────────────────────────────────────
// New products always start as "pending" — admin must approve before going live
const createProduct = async (req, res) => {
  try {
    const { title, description, price, stock, category, brand, photos } = req.body;

    const product = await Product.create({
      title,
      description,
      price,
      stock,
      category,
      brand,
      photos: photos || [],
      supplier: req.user._id,
      status: 'pending',
    });

    logger.info(`Product submitted by ${req.user.email}: "${title}"`);
    return res.status(201).json({
      message: 'Product submitted successfully and is pending admin approval.',
      product,
    });
  } catch (err) {
    logger.error(`supplier.createProduct error: ${err.message}`);
    return res.status(500).json({ message: 'Failed to create product.' });
  }
};

// ─── PUT /api/supplier/products/:id ──────────────────────────────────────────
// Supplier can only edit their own products. Editing re-triggers approval.
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id:      req.params.id,
      supplier: req.user._id,
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const editable = ['title', 'description', 'price', 'stock', 'brand', 'photos'];
    editable.forEach((field) => {
      if (req.body[field] !== undefined) product[field] = req.body[field];
    });

    // Re-submit for admin approval if the product was already approved
    if (product.status === 'approved') {
      product.status = 'pending';
    }

    await product.save();
    logger.info(`Product updated by ${req.user.email}: ${product._id}`);
    return res.json({ message: 'Product updated and re-submitted for approval.', product });
  } catch (err) {
    logger.error(`supplier.updateProduct error: ${err.message}`);
    return res.status(500).json({ message: 'Failed to update product.' });
  }
};

// ─── DELETE /api/supplier/products/:id ───────────────────────────────────────
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id:      req.params.id,
      supplier: req.user._id,
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    logger.info(`Product deleted by ${req.user.email}: "${product.title}"`);
    return res.json({ message: 'Product deleted successfully.' });
  } catch (err) {
    logger.error(`supplier.deleteProduct error: ${err.message}`);
    return res.status(500).json({ message: 'Failed to delete product.' });
  }
};

// ─── GET /api/supplier/orders ─────────────────────────────────────────────────
// Returns only the line items belonging to this supplier within each order
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 'items.supplier': req.user._id })
      .populate('buyer', 'firstName lastName email')
      .sort({ createdAt: -1 });

    const result = orders.map((order) => {
      const myItems = order.items.filter(
        (item) => item.supplier.toString() === req.user._id.toString()
      );
      const myTotal = myItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

      return {
        _id:             order._id,
        buyer:           order.buyer,
        status:          order.status,
        shippingAddress: order.shippingAddress,
        createdAt:       order.createdAt,
        items:           myItems,
        totalAmount:     myTotal,
      };
    });

    return res.json(result);
  } catch (err) {
    logger.error(`supplier.getMyOrders error: ${err.message}`);
    return res.status(500).json({ message: 'Failed to fetch orders.' });
  }
};

// ─── GET /api/supplier/stats ──────────────────────────────────────────────────
const getStats = async (req, res) => {
  try {
    const [products, orders] = await Promise.all([
      Product.find({ supplier: req.user._id }),
      Order.find({ 'items.supplier': req.user._id }),
    ]);

    const totalRevenue = orders.reduce((sum, order) => {
      const myItems = order.items.filter(
        (item) => item.supplier.toString() === req.user._id.toString()
      );
      return sum + myItems.reduce((s, i) => s + i.price * i.quantity, 0);
    }, 0);

    const totalUnitsSold = orders.reduce((sum, order) => {
      const myItems = order.items.filter(
        (item) => item.supplier.toString() === req.user._id.toString()
      );
      return sum + myItems.reduce((s, i) => s + i.quantity, 0);
    }, 0);

    return res.json({
      totalProducts:    products.length,
      approvedProducts: products.filter((p) => p.status === 'approved').length,
      pendingProducts:  products.filter((p) => p.status === 'pending').length,
      rejectedProducts: products.filter((p) => p.status === 'rejected').length,
      totalOrders:      orders.length,
      totalRevenue,
      totalUnitsSold,
    });
  } catch (err) {
    logger.error(`supplier.getStats error: ${err.message}`);
    return res.status(500).json({ message: 'Failed to fetch stats.' });
  }
};

module.exports = { getMyProducts, createProduct, updateProduct, deleteProduct, getMyOrders, getStats };
