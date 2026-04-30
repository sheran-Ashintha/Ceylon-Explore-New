const mongoose = require("mongoose");

const tourServiceSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true, index: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, index: true },
    location: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    priceRange: { type: String, required: true, trim: true },
    tag: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    availability: { type: String, default: "", trim: true },
    vehicle: { type: String, default: "", trim: true },
    idealFor: { type: String, default: "", trim: true },
    phone: { type: String, default: null, trim: true },
    whatsapp: { type: String, default: null, trim: true },
    displayOrder: { type: Number, required: true, min: 0, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TourService", tourServiceSchema);