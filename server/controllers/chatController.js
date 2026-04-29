const ChatMessage = require("../models/ChatMessage");
const User = require("../models/User");

const ACTIVE_MEMBER_WINDOW_MS = 1000 * 60 * 30;

function toMemberPayload(member, options) {
  const {
    currentUserId,
    friendIds,
    incomingRequestIds,
    outgoingRequestIds,
    recentActivityMap,
  } = options;
  const memberId = String(member._id);

  return {
    ...member,
    isActiveNow: recentActivityMap.has(memberId) || memberId === currentUserId,
    lastMessageAt: recentActivityMap.get(memberId) || null,
    isFriend: friendIds.has(memberId),
    hasIncomingRequest: incomingRequestIds.has(memberId),
    hasOutgoingRequest: outgoingRequestIds.has(memberId),
  };
}

function serializeUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role || "user",
    friends: user.friends || [],
  };
}

async function getMessages(req, res) {
  try {
    const rawMessages = await ChatMessage.find()
      .sort({ createdAt: -1 })
      .limit(80)
      .populate("sender", "name")
      .lean();

    const messages = rawMessages.reverse().map((message) => ({
      ...message,
      sender: message.sender || { name: "Deleted user" },
    }));

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function createMessage(req, res) {
  try {
    const body = String(req.body?.body || "").trim();

    if (!body) {
      return res.status(400).json({ message: "Message text is required." });
    }

    if (body.length > 500) {
      return res.status(400).json({ message: "Message must be 500 characters or less." });
    }

    const message = await ChatMessage.create({
      sender: req.userId,
      body,
    });

    await message.populate("sender", "name");
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getMembers(req, res) {
  try {
    const currentUser = await User.findById(req.userId)
      .select("friends friendRequestsReceived friendRequestsSent")
      .lean();

    if (!currentUser) {
      return res.status(404).json({ message: "User not found." });
    }

    const currentUserId = String(req.userId);
    const friendIds = new Set((currentUser.friends || []).map((friendId) => String(friendId)));
    const incomingRequestIds = new Set((currentUser.friendRequestsReceived || []).map((friendId) => String(friendId)));
    const outgoingRequestIds = new Set((currentUser.friendRequestsSent || []).map((friendId) => String(friendId)));
    const activeSince = new Date(Date.now() - ACTIVE_MEMBER_WINDOW_MS);
    const recentMessages = await ChatMessage.aggregate([
      { $match: { createdAt: { $gte: activeSince } } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$sender",
          lastMessageAt: { $first: "$createdAt" },
        },
      },
      { $sort: { lastMessageAt: -1 } },
    ]);
    const recentActivityMap = new Map(
      recentMessages.map((entry) => [String(entry._id), entry.lastMessageAt]),
    );

    const activeUserIds = recentMessages.map((entry) => String(entry._id));

    if (!activeUserIds.includes(currentUserId)) {
      activeUserIds.unshift(currentUserId);
    }

    const relatedUserIds = Array.from(new Set([
      ...activeUserIds,
      ...Array.from(incomingRequestIds),
      ...Array.from(outgoingRequestIds),
    ]));

    const members = await User.find({ _id: { $in: relatedUserIds } })
      .select("_id name role createdAt")
      .lean();

    const memberMap = new Map(members.map((member) => [String(member._id), member]));
    const activeMembers = activeUserIds
      .map((id) => memberMap.get(id))
      .filter(Boolean)
      .map((member) => toMemberPayload(member, {
        currentUserId,
        friendIds,
        incomingRequestIds,
        outgoingRequestIds,
        recentActivityMap,
      }));

    const incomingRequests = Array.from(incomingRequestIds)
      .map((id) => memberMap.get(id))
      .filter(Boolean);

    res.json({
      activeMembers,
      incomingRequests: incomingRequests.map((member) => toMemberPayload(member, {
        currentUserId,
        friendIds,
        incomingRequestIds,
        outgoingRequestIds,
        recentActivityMap,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function addFriend(req, res) {
  try {
    const memberId = String(req.params.memberId || "").trim();

    if (!memberId) {
      return res.status(400).json({ message: "Friend id is required." });
    }

    if (memberId === String(req.userId)) {
      return res.status(400).json({ message: "You cannot add yourself as a friend." });
    }

    const currentUser = await User.findById(req.userId)
      .select("friends friendRequestsReceived friendRequestsSent")
      .lean();

    if (!currentUser) {
      return res.status(404).json({ message: "User not found." });
    }

    if ((currentUser.friends || []).some((friendId) => String(friendId) === memberId)) {
      return res.status(400).json({ message: "This user is already your friend." });
    }

    if ((currentUser.friendRequestsSent || []).some((friendId) => String(friendId) === memberId)) {
      return res.status(400).json({ message: "Friend request already sent." });
    }

    if ((currentUser.friendRequestsReceived || []).some((friendId) => String(friendId) === memberId)) {
      return res.status(400).json({ message: "This user already sent you a friend request." });
    }

    const targetUser = await User.findById(memberId).select("_id name").lean();

    if (!targetUser) {
      return res.status(404).json({ message: "User not found." });
    }

    await Promise.all([
      User.findByIdAndUpdate(req.userId, {
        $addToSet: { friendRequestsSent: memberId },
      }),
      User.findByIdAndUpdate(memberId, {
        $addToSet: { friendRequestsReceived: req.userId },
      }),
    ]);

    res.json({
      message: `Friend request sent to ${targetUser.name}.`,
      memberId,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function acceptFriendRequest(req, res) {
  try {
    const memberId = String(req.params.memberId || "").trim();

    if (!memberId) {
      return res.status(400).json({ message: "Friend id is required." });
    }

    const currentUser = await User.findById(req.userId)
      .select("friendRequestsReceived")
      .lean();

    if (!currentUser) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!(currentUser.friendRequestsReceived || []).some((friendId) => String(friendId) === memberId)) {
      return res.status(400).json({ message: "No incoming friend request from this user." });
    }

    const targetUser = await User.findById(memberId).select("_id name").lean();

    if (!targetUser) {
      return res.status(404).json({ message: "User not found." });
    }

    await Promise.all([
      User.findByIdAndUpdate(req.userId, {
        $pull: { friendRequestsReceived: memberId, friendRequestsSent: memberId },
        $addToSet: { friends: memberId },
      }),
      User.findByIdAndUpdate(memberId, {
        $pull: { friendRequestsReceived: req.userId, friendRequestsSent: req.userId },
        $addToSet: { friends: req.userId },
      }),
    ]);

    res.json({
      message: `You are now friends with ${targetUser.name}.`,
      memberId,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function declineFriendRequest(req, res) {
  try {
    const memberId = String(req.params.memberId || "").trim();

    if (!memberId) {
      return res.status(400).json({ message: "Friend id is required." });
    }

    await Promise.all([
      User.findByIdAndUpdate(req.userId, {
        $pull: { friendRequestsReceived: memberId, friendRequestsSent: memberId },
      }),
      User.findByIdAndUpdate(memberId, {
        $pull: { friendRequestsReceived: req.userId, friendRequestsSent: req.userId },
      }),
    ]);

    res.json({
      message: "Friend request declined.",
      memberId,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  addFriend,
  acceptFriendRequest,
  createMessage,
  declineFriendRequest,
  getMembers,
  getMessages,
};