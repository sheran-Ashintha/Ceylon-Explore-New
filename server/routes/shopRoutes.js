const express = require("express");
const { getShop, getShops } = require("../controllers/shopController");

const router = express.Router();

router.get("/", getShops);
router.get("/:id", getShop);

module.exports = router;