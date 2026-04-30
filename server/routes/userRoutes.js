const express = require("express");

const { deleteUser, getUsers } = require("../controllers/userController");
const adminOnly = require("../middleware/adminMiddleware");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, adminOnly, getUsers);
router.delete("/:id", protect, adminOnly, deleteUser);

module.exports = router;