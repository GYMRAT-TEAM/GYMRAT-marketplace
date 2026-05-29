const mongoose = require("mongoose");

const specSchema = new mongoose.Schema({
  key: String,
  value: String
}, { _id: false });

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    oldPrice: Number,
    stock: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    type: String, // e.g. "Supplements", "Clothing"
    sport: String, // e.g. "Gym", "Football"
    badge: String, // e.g. "NEW", "HOT"
    color: String,
    size: String,
    
    // Instead of single image, support multiple
    img: String, 
    images: [String],
    
    specs: [specSchema],

    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["approved", "pending"],
      default: "approved",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);