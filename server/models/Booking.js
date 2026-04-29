const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookingSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  bookingType: { type: String, enum: ["destination", "package"], default: "destination" },
  destination: { type: Schema.Types.ObjectId, ref: "Destination", default: null },
  package: {
    title: String,
    slug: String,
    category: String,
    image: String,
    days: Number,
    price: Number,
  },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: { type: Number, required: true, default: 1, min: 1 },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ["confirmed", "cancelled"], default: "confirmed" },
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
