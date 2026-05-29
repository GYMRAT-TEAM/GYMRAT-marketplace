const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String,

    role: {
      type: String,
      enum: ["super_admin", "supplier", "buyer"],
      default: "buyer",
    },

    status: {
      type: String,
      enum: ["active", "inactive", "suspended", "pending"],
      default: "active",
    },

    plan: String,
    businessName: String,
    kycStatus: String,

    // Profile details (for Settings page)
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    address: String,
    phone: String,
    dateOfBirth: String,
    location: String,
    postalCode: String,
    avatar: { type: String, default: null },

  },
  { timestamps: true }
);

// 🔐 Hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = bcrypt.hashSync(this.password, 10);
});

// 🔑 Compare password
userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compareSync(enteredPassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model("User", userSchema);