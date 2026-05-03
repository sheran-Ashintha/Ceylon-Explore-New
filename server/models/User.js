const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String, unique: true, sparse: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  friendRequestsReceived: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  friendRequestsSent: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  chatLocation: {
    isVisible: { type: Boolean, default: false },
    latitude: { type: Number, min: -90, max: 90, default: null },
    longitude: { type: Number, min: -180, max: 180, default: null },
    updatedAt: { type: Date, default: null },
  },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
