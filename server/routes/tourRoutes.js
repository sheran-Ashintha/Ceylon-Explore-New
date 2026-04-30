const express = require("express");
const { getTourService, getTourServices } = require("../controllers/tourController");

const router = express.Router();

router.get("/", getTourServices);
router.get("/:id", getTourService);

module.exports = router;