const express = require("express");
const {
	createTourService,
	deleteTourService,
	getTourService,
	getTourServices,
	updateTourService,
} = require("../controllers/tourController");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", getTourServices);
router.post("/", protect, adminOnly, createTourService);
router.get("/:id", getTourService);
router.put("/:id", protect, adminOnly, updateTourService);
router.delete("/:id", protect, adminOnly, deleteTourService);

module.exports = router;