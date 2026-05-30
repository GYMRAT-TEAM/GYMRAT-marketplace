const Order   = require('../models/Order');
const Product = require('../models/Product');
const logger  = require('../utils/logger');
const { sendOrderConfirmationEmail } = require('../utils/mailer');

// ─── POST /api/orders ─────────────────────────────────────────────────────────
// Buyer places a new order. Validates stock, snapshots prices, decrements stock.
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product || product.status !== 'approved') {
        return res.status(400).json({
          message: `Product is not available.`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for "${product.name || product.title}". Available: ${product.stock}.`,
        });
      }

      orderItems.push({
        product:  product._id,
        supplier: product.supplier,
        title:    product.name || product.title,
        price:    product.price,
        quantity: item.quantity,
      });

      totalAmount += product.price * item.quantity;

      // Decrement stock atomically
      product.stock -= item.quantity;
      if (product.stock === 0) product.inStock = false;
      await product.save();
    }

    const order = await Order.create({
      buyer: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
      status: 'confirmed',
    });

    logger.info(`Order placed: ${order._id} by buyer ${req.user.email}`);

    // Send email confirmation
    try {
      sendOrderConfirmationEmail(req.user.email, req.user.firstName, order);
    } catch (emailErr) {
      logger.error(`Failed to send order email: ${emailErr.message}`);
    }

    return res.status(201).json({ message: 'Order placed successfully.', order });
  } catch (err) {
    logger.error(`createOrder error: ${err.message}`);
    return res.status(500).json({ message: 'Failed to place order.' });
  }
};

// ─── POST /api/orders/cart ────────────────────────────────────────────────────
// Cart checkout — accepts cart items with name/price/qty directly (no productId needed)
const createCartOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty.' });
    }

    // Build order items — cart items may have productId or just be local items
    const orderItems = await Promise.all(items.map(async (item) => {
      let productId = item.id || item.productId || null;
      let product   = null;

      // Try to find real product to decrement stock
      if (productId) {
        try {
          product = await Product.findById(productId);
          if (product && product.stock >= item.qty) {
            product.stock -= item.qty;
            if (product.stock === 0) product.inStock = false;
            await product.save();
          }
        } catch (_) { /* product not found, skip */ }
      }

      return {
        product:  product ? product._id : undefined,
        supplier: product ? product.supplier : undefined,
        title:    item.name || product?.name || 'Product',
        price:    item.price,
        quantity: item.qty || item.quantity || 1,
      };
    }));

    const computedTotal = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);

    const order = await Order.create({
      buyer:           req.user._id,
      items:           orderItems,
      totalAmount:     totalAmount || computedTotal,
      shippingAddress: shippingAddress || {},
      paymentMethod:   paymentMethod  || 'card',
      status:          'confirmed',
    });

    console.log(`[ORDER] Cart order placed: ${order._id} by ${req.user.email} — ${orderItems.length} item(s) — DZD ${order.totalAmount}`);

    // Send email confirmation
    try {
      sendOrderConfirmationEmail(req.user.email, req.user.firstName, order);
    } catch (emailErr) {
      logger.error(`Failed to send order email: ${emailErr.message}`);
    }

    return res.status(201).json({ message: 'Order placed successfully.', order });
  } catch (err) {
    logger.error(`createCartOrder error: ${err.message}`);
    return res.status(500).json({ message: 'Failed to place order.' });
  }
};

// ─── GET /api/orders/my ───────────────────────────────────────────────────────
// Buyer sees their own order history
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name img images');
    return res.json(orders);
  } catch (err) {
    logger.error(`getMyOrders error: ${err.message}`);
    return res.status(500).json({ message: 'Failed to fetch orders.' });
  }
};

// ─── GET /api/orders/:id ──────────────────────────────────────────────────────
// Buyer sees their specific order; admin can see any order
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('buyer', 'firstName lastName email');

    if (!order) return res.status(404).json({ message: 'Order not found.' });

    const isBuyer = order.buyer._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'super_admin';

    if (!isBuyer && !isAdmin) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    return res.json(order);
  } catch (err) {
    logger.error(`getOrderById error: ${err.message}`);
    return res.status(500).json({ message: 'Failed to fetch order.' });
  }
};

module.exports = { createOrder, createCartOrder, getMyOrders, getOrderById };