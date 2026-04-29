const Review = require("../models/Review");
const Destination = require("../models/Destination");

const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const destId = req.params.id;
    const review = await Review.create({ user: req.userId, destination: destId, rating, comment });
    const populated = await review.populate("user", "name");
    const reviews = await Review.find({ destination: destId });
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Destination.findByIdAndUpdate(destId, { rating: Math.round(avg * 10) / 10, reviewCount: reviews.length });
    res.status(201).json(populated);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ destination: req.params.id })
      .populate("user", "name")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { addReview, getReviews };
