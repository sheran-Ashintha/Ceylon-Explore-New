const express = require("express");
const {
	createShop,
	deleteShop,
	getShop,
	getShops,
	updateShop,
} = require("../controllers/shopController");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", getShops);
router.post("/", protect, adminOnly, createShop);
router.get("/:id", getShop);
router.put("/:id", protect, adminOnly, updateShop);
router.delete("/:id", protect, adminOnly, deleteShop);

module.exports = router;