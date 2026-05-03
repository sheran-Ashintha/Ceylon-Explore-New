const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
	addFriend,
	acceptFriendRequest,
	createMessage,
	declineFriendRequest,
	getMembers,
	getMessages,
	updateLocation,
} = require("../controllers/chatController");

const router = express.Router();

router.use(protect);

router.get("/messages", getMessages);
router.post("/messages", createMessage);
router.get("/members", getMembers);
router.put("/location", updateLocation);
router.post("/friends/:memberId", addFriend);
router.post("/friends/:memberId/accept", acceptFriendRequest);
router.post("/friends/:memberId/decline", declineFriendRequest);

module.exports = router;