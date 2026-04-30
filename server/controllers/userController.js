const Booking = require("../models/Booking");
const ChatMessage = require("../models/ChatMessage");
const Review = require("../models/Review");
const User = require("../models/User");

function serializeAdminUser(user) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role || "user",
    authProvider: user.googleId ? (user.password ? "Email + Google" : "Google") : "Email",
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

async function getUsers(req, res) {
  try {
    const users = await User.find()
      .sort({ createdAt: -1 })
      .select("_id name email role googleId password createdAt updatedAt")
      .lean();

    res.json(users.map(serializeAdminUser));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function deleteUser(req, res) {
  try {
    const targetUserId = String(req.params.id);

    if (targetUserId === String(req.userId)) {
      return res.status(400).json({ message: "You cannot delete your own admin account." });
    }

    const user = await User.findById(targetUserId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.role === "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });

      if (adminCount <= 1) {
        return res.status(400).json({ message: "The last admin account cannot be deleted." });
      }
    }

    await Promise.all([
      User.updateMany(
        { _id: { $ne: user._id } },
        {
          $pull: {
            friends: user._id,
            friendRequestsReceived: user._id,
            friendRequestsSent: user._id,
          },
        }
      ),
      Booking.deleteMany({ user: user._id }),
      ChatMessage.deleteMany({ sender: user._id }),
      Review.deleteMany({ user: user._id }),
    ]);

    await user.deleteOne();

    res.json({ message: "User deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  deleteUser,
  getUsers,
};