const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        supplier: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        title: String,
        price: Number,
        quantity: Number,
      },
    ],

    totalAmount: Number,

    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "delivered", "cancelled"],
      default: "pending",
    },

    paymentMethod: String,

    shippingAddress: {
      fullName: String,
      address: String,
      city: String,
      wilaya: String,
      phone: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);