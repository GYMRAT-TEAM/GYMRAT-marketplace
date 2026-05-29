const User    = require('../models/User');
const Product = require('../models/Product');
const Order   = require('../models/Order');
const logger  = require('../utils/logger');

// ─── GET /api/admin/dashboard-stats ──────────────────────────────────────────
// Matches the shape expected by AdminDashboard.jsx
const getDashboardStats = async (req, res) => {
  try {
    const today = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [orders, pendingSuppliers, pendingProducts, totalUsers] = await Promise.all([
      Order.find()
        .populate('buyer', 'firstName lastName')
        .sort({ createdAt: -1 }),
      User.find({ role: 'supplier', status: 'pending' }),
      Product.countDocuments({ status: 'pending' }),
      User.countDocuments(),
    ]);

    const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const avgSales   = orders.length > 0 ? totalSales / orders.length : 0;

    const stats = {
      grossSales:    totalSales,
      avgSales,
      newSalesCount: orders.filter((o) => o.createdAt > today).length,
      grossProfits:  totalSales * 0.15, // 15% platform commission
      totalUsers,
      pendingProducts,

      // Shape matches AdminDashboard.jsx → order.product.title / order.buyer.firstName
      recentOrders: orders.slice(0, 4).map((o) => ({
        _id:       o._id,
        product:   { title: o.items[0]?.title || 'Multiple items' },
        buyer:     o.buyer,
        amount:    o.totalAmount,
        status:    o.status,
        createdAt: o.createdAt,
      })),

      // KYC queue → pending supplier accounts
      kycQueue: pendingSuppliers.map((u) => ({
        id:     u._id,
        name:   `${u.firstName} ${u.lastName}`,
        role:   u.role,
        docs:   'Business docs',
        status: u.status,
        email:  u.email,
      })),

      // Recent transactions table
      transactions: orders.slice(0, 5).map((o) => ({
        name:    o.buyer?.firstName || 'Unknown',
        product: o.items[0]?.title  || 'Multiple items',
        date:    o.createdAt.toLocaleDateString(),
        amount:  o.totalAmount,
        status:  o.status,
      })),
    };

    return res.json(stats);
  } catch (err) {
    logger.error(`admin.getDashboardStats error: ${err.message}`);
    return res.status(500).json({ message: 'Failed to fetch dashboard statistics.' });
  }
};

// ─── GET /api/admin/users ─────────────────────────────────────────────────────
const getUsers = async (req, res) => {
  try {
    const { role, status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (role)   filter.role   = role;
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(filter),
    ]);

    return res.json({ users, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    logger.error(`admin.getUsers error: ${err.message}`);
    return res.status(500).json({ message: 'Failed to fetch users.' });
  }
};

// ─── PUT /api/admin/users/:id/approve ────────────────────────────────────────
const approveUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: 'active' },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found.' });

    logger.info(`Admin ${req.user.email} approved user: ${user.email}`);
    return res.json({ message: `${user.firstName} approved successfully.`, user });
  } catch (err) {
    logger.error(`admin.approveUser error: ${err.message}`);
    return res.status(500).json({ message: 'Failed to approve user.' });
  }
};

// ─── PUT /api/admin/users/:id/suspend ────────────────────────────────────────
const suspendUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: 'suspended' },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found.' });

    logger.info(`Admin ${req.user.email} suspended user: ${user.email}`);
    return res.json({ message: `${user.firstName} suspended.`, user });
  } catch (err) {
    logger.error(`admin.suspendUser error: ${err.message}`);
    return res.status(500).json({ message: 'Failed to suspend user.' });
  }
};

// ─── GET /api/admin/products ──────────────────────────────────────────────────
const getProducts = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('supplier', 'firstName lastName email businessName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    return res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    logger.error(`admin.getProducts error: ${err.message}`);
    return res.status(500).json({ message: 'Failed to fetch products.' });
  }
};

// ─── PUT /api/admin/products/:id/approve ─────────────────────────────────────
const approveProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', rejectionReason: undefined },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    logger.info(`Admin ${req.user.email} approved product: "${product.title}"`);
    return res.json({ message: 'Product approved and is now live.', product });
  } catch (err) {
    logger.error(`admin.approveProduct error: ${err.message}`);
    return res.status(500).json({ message: 'Failed to approve product.' });
  }
};

// ─── PUT /api/admin/products/:id/reject ──────────────────────────────────────
const rejectProduct = async (req, res) => {
  try {
    const { reason } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', rejectionReason: reason || 'Did not meet platform guidelines.' },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    logger.info(`Admin ${req.user.email} rejected product: "${product.title}"`);
    return res.json({ message: 'Product rejected.', product });
  } catch (err) {
    logger.error(`admin.rejectProduct error: ${err.message}`);
    return res.status(500).json({ message: 'Failed to reject product.' });
  }
};

// ─── GET /api/admin/orders ────────────────────────────────────────────────────
const getOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('buyer', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(filter),
    ]);

    return res.json({ orders, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    logger.error(`admin.getOrders error: ${err.message}`);
    return res.status(500).json({ message: 'Failed to fetch orders.' });
  }
};

// ─── POST /api/admin/products ─────────────────────────────────────────────────
const addProduct = async (req, res) => {
  try {
    const { name, brand, description, price, oldPrice, stock, type, sport, badge, img, images, color, size } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: 'Product name and price are required.' });
    }

    const PREMIUM_PLANS = ['business', 'vip', 'Business', 'VIP'];
    const isAdmin   = req.user.role === 'super_admin';
    const isPremium = PREMIUM_PLANS.includes(req.user.plan);
    // Auto-approve for admin or premium plan users
    const productStatus = (isAdmin || isPremium) ? 'approved' : 'pending';

    const product = await Product.create({
      name,
      brand:       brand       || 'GymRat',
      description: description || '',
      price:       Number(price),
      oldPrice:    oldPrice ? Number(oldPrice) : undefined,
      stock:       Number(stock) || 0,
      inStock:     Number(stock) > 0,
      type:        type  || 'General',
      sport:       sport || 'Gym',
      badge:       badge || '',
      img:         img   || '',
      images:      images || (img ? [img] : []),
      color, size,
      supplier:    req.user._id,
      status:      productStatus,
    });

    logger.info(`${req.user.email} (${req.user.plan || req.user.role}) added product: "${product.name}"`);
    return res.status(201).json({ message: 'Product created successfully.', product });
  } catch (err) {
    logger.error(`admin.addProduct error: ${err.message}`);
    return res.status(500).json({ message: 'Failed to create product.' });
  }
};

// ─── DELETE /api/admin/products/:id ──────────────────────────────────────────
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    logger.info(`Admin ${req.user.email} deleted product: "${product.name}"`);
    return res.json({ message: 'Product deleted successfully.' });
  } catch (err) {
    logger.error(`admin.deleteProduct error: ${err.message}`);
    return res.status(500).json({ message: 'Failed to delete product.' });
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  approveUser,
  suspendUser,
  getProducts,
  approveProduct,
  rejectProduct,
  addProduct,
  deleteProduct,
  getOrders,
};
