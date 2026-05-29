const mongoose = require("mongoose");
const dns = require("dns");
dns.setServers(['8.8.8.8', '1.1.1.1']);
require("dotenv").config();

const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🌱 Connected to MongoDB...");

    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({}),
    ]);

    console.log("🗑 Cleared old data");

    // USERS
    const admin = await User.create({
      firstName: "Admin",
      lastName: "GymRat",
      email: "admin@gymrat.com",
      password: "gymrat123",
      role: "super_admin",
    });

    const supplier = await User.create({
      firstName: "Ahmed",
      lastName: "Fitness",
      email: "ahmed@gymrat.com",
      password: "gymrat123",
      role: "supplier",
      businessName: "Ahmed Fitness Store",
    });

    const buyer = await User.create({
      firstName: "Sarah",
      lastName: "Buyer",
      email: "sarah@gymrat.com",
      password: "gymrat123",
      role: "buyer",
    });

    console.log("👤 Users created");

    // PRODUCTS
    const p1 = await Product.create({
      name: "Whey Protein",
      brand: "OPTIMUM NUTRITION",
      price: 9600,
      stock: 50,
      supplier: supplier._id,
      status: "approved",
      img: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=500',
      images: ['https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=500']
    });

    const p2 = await Product.create({
      name: "Gym Bag",
      brand: "GYMRAT",
      price: 4500,
      stock: 30,
      supplier: supplier._id,
      status: "approved",
      img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=500',
      images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=500']
    });

    console.log("📦 Products created");

    // ORDER
    await Order.create({
      buyer: buyer._id,
      items: [
        {
          product: p1._id,
          supplier: supplier._id,
          title: p1.title,
          price: p1.price,
          quantity: 1,
        },
      ],
      totalAmount: p1.price,
      status: "delivered",
    });

    console.log("🛒 Orders created");

    console.log("✅ SEED DONE");
    console.log("admin@gymrat.com / gymrat123");

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

seed();