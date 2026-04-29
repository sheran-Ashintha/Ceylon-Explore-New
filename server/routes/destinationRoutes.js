const express = require("express");
const router = express.Router();
const Destination = require("../models/Destination");

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

// POST new destination
router.post("/", async (req, res) => {
  try {
    const newDest = new Destination(req.body);
    const saved = await newDest.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
