const express = require("express");
const router = express.Router({ mergeParams: true });
const { addReview, getReviews } = require("../controllers/reviewController");
const protect = require("../middleware/authMiddleware");

router.get("/", getReviews);
router.post("/", protect, addReview);

module.exports = router;
