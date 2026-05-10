const express = require("express");
const router = express.Router();
const Destination = require("../models/Destination");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

// GET all destinations with optional search/filter
router.get("/", async (req, res) => {
  try {
    const { search, tag, category, minPrice, maxPrice } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (tag) filter.tag = tag;
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const data = await Destination.find(filter);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single destination by ID
router.get("/:id", async (req, res) => {
  try {
    const dest = await Destination.findById(req.params.id);
    if (!dest) return res.status(404).json({ message: "Destination not found." });
    res.json(dest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new destination (admin only)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const newDest = new Destination(req.body);
    const saved = await newDest.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE destination by ID (admin only)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const deletedDestination = await Destination.findByIdAndDelete(req.params.id);

    if (!deletedDestination) {
      return res.status(404).json({ message: "Destination not found." });
    }

    return res.json({ message: "Destination deleted." });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
