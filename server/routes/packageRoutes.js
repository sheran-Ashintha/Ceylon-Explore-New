const express = require("express");
const router = express.Router();
const {
	createPackage,
	deletePackage,
	getPackage,
	getPackages,
	updatePackage,
} = require("../controllers/packageController");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

router.get("/", getPackages);
router.post("/", protect, adminOnly, createPackage);
router.get("/:slug", getPackage);
router.put("/:slug", protect, adminOnly, updatePackage);
router.delete("/:slug", protect, adminOnly, deletePackage);

module.exports = router;