const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');

// GET /api/admin/dashboard-stats
router.get('/dashboard-stats', async (req, res) => {
  try {
    const orders = await Order.find().populate('product buyer seller');
    const pendingKyc = await User.find({ kycStatus: 'Pending' });

    const totalSales = orders.reduce((sum, order) => sum + order.amount, 0);
    const avgSales = orders.length > 0 ? (totalSales / orders.length) : 0;
    
    // Mocking some 'New' and 'Profit' metrics for the dashboard
    const stats = {
      grossSales: totalSales,
      avgSales: avgSales,
      newSalesCount: orders.filter(o => o.createdAt > new Date(Date.now() - 24*60*60*1000)).length,
      grossProfits: totalSales * 0.15, // 15% commission mock
      recentOrders: orders.slice(-4).reverse(),
      kycQueue: pendingKyc.map(user => ({
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
        docs: 'ID + Selfie', // Mocking docs string
        status: user.kycStatus,
        color: '#e58e26'
      })),
      transactions: orders.slice(-3).reverse().map(o => ({
        name: o.buyer.firstName,
        product: o.product.title,
        date: o.createdAt.toLocaleDateString(),
        amount: o.amount,
        status: o.status
      }))
    };

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stats', error: err.message });
  }
});

module.exports = router;
