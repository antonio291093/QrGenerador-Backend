const mongoose = require("mongoose");

const qrSchema = new mongoose.Schema({
  url: { type: String, required: true }, // URL del QR en Cloudinary
  resourceUrl: { type: String, required: true }, // URL codificada en el QR
  logoUrl: { type: String }, // Logo usado en el QR
  createdAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    mustChangePassword: { type: Boolean, default: true },
    qrs: [qrSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
