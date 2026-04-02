const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🌱 Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    // 1. Create Users
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'GymRat',
      email: 'admin@gymrat.com',
      password: 'password123',
      role: 'Admin',
      plan: 'Business'
    });

    const seller = await User.create({
      firstName: 'Ahmed',
      lastName: 'Seller',
      email: 'ahmed@gymrat.com',
      password: 'password123',
      role: 'Seller',
      plan: 'VIP',
      kycStatus: 'Verified'
    });

    const buyer = await User.create({
      firstName: 'Sarah',
      lastName: 'Buyer',
      email: 'sarah@gymrat.com',
      password: 'password123',
      role: 'Buyer',
      plan: 'Free'
    });

    // 2. Create Products
    const p1 = await Product.create({
      title: 'Whey Protein 2kg',
      price: 9600,
      description: 'Premium quality whey protein',
      seller: seller._id,
      status: 'Approved',
      category: 'PROTEIN'
    });

    const p2 = await Product.create({
      title: 'Gym Bag XL',
      price: 4500,
      description: 'Large gym bag with shoe compartment',
      seller: seller._id,
      status: 'Approved',
      category: 'EQUIPMENT'
    });

    // 3. Create Orders
    await Order.create({
      product: p1._id,
      buyer: buyer._id,
      seller: seller._id,
      amount: 9600,
      status: 'Delivered'
    });

    await Order.create({
      product: p2._id,
      buyer: buyer._id,
      seller: seller._id,
      amount: 4500,
      status: 'Processing'
    });

    console.log('✅ Seeding completed!');
    process.exit();
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedData();
