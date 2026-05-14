const express = require("express");
const { getSosContent, updateSosContent } = require("../controllers/sosController");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", getSosContent);
router.put("/", protect, adminOnly, updateSosContent);

module.exports = router;