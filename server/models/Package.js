const mongoose = require("mongoose");

const PACKAGE_CATEGORIES = ["Beach", "Culture", "Nature", "Wildlife", "Wellness", "Holiday"];

const packageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    category: { type: String, required: true, enum: PACKAGE_CATEGORIES },
    days: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 1 },
    text: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    displayOrder: { type: Number, required: true, min: 0, index: true },
  },
  { timestamps: true }
);

const Package = mongoose.model("Package", packageSchema);

module.exports = Package;
module.exports.PACKAGE_CATEGORIES = PACKAGE_CATEGORIES;