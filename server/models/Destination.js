const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: String,
  description: String,
  price: Number,
  images: [String],
  tag: String,
  category: {
    type: String,
    enum: ["Hotel", "Villa", "Resort", "Guesthouse", "Hostel"],
    default: "Hotel",
  },
  amenities: [String],
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Destination", destinationSchema);
