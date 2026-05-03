const ChatMessage = require("../models/ChatMessage");
const User = require("../models/User");
const { getAvatarUrl } = require("../utils/avatar");

const ACTIVE_MEMBER_WINDOW_MS = 1000 * 60 * 30;
const CHAT_COORDINATE_PRECISION = 5;

function normalizeCoordinate(value) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return null;
  }

  return Number(parsed.toFixed(CHAT_COORDINATE_PRECISION));
}

function toLocationPayload(member) {
  const location = member?.chatLocation || {};
  const latitude = Number(location.latitude);
  const longitude = Number(location.longitude);
  const hasCoordinates = Number.isFinite(latitude) && Number.isFinite(longitude);

  return {
    isVisible: Boolean(location.isVisible && hasCoordinates),
    latitude: hasCoordinates ? latitude : null,
    longitude: hasCoordinates ? longitude : null,
    updatedAt: location.updatedAt || null,
  };
}

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
    avatarUrl: getAvatarUrl(member.email),
    location: toLocationPayload(member),
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
      .populate("sender", "name email")
      .lean();

    const messages = rawMessages.reverse().map((message) => ({
      ...message,
      sender: message.sender
        ? {
          ...message.sender,
          avatarUrl: getAvatarUrl(message.sender.email),
        }
        : { name: "Deleted user", avatarUrl: "" },
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

    await message.populate("sender", "name email");
    const payload = message.toObject();
    payload.sender = payload.sender
      ? {
        ...payload.sender,
        avatarUrl: getAvatarUrl(payload.sender.email),
      }
      : { name: "Deleted user", avatarUrl: "" };

    res.status(201).json(payload);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getMembers(req, res) {
  try {
    const currentUser = await User.findById(req.userId)
      .select("friends friendRequestsReceived friendRequestsSent chatLocation")
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
    const availableUsers = await User.find({ "chatLocation.isVisible": true })
      .select("_id")
      .lean();
    const availableUserIds = availableUsers.map((entry) => String(entry._id));

    const rankedMemberIds = Array.from(new Set([
      currentUserId,
      ...recentMessages.map((entry) => String(entry._id)),
      ...availableUserIds,
    ]));

    const relatedUserIds = Array.from(new Set([
      ...rankedMemberIds,
      ...Array.from(incomingRequestIds),
      ...Array.from(outgoingRequestIds),
    ]));

    const members = await User.find({ _id: { $in: relatedUserIds } })
      .select("_id name email role createdAt chatLocation")
      .lean();

    const memberMap = new Map(members.map((member) => [String(member._id), member]));
    const activeMembers = rankedMemberIds
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
      selfLocation: toLocationPayload(currentUser),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function updateLocation(req, res) {
  try {
    const { isVisible, latitude, longitude } = req.body || {};

    if (typeof isVisible !== "boolean") {
      return res.status(400).json({ message: "isVisible must be a boolean value." });
    }

    if (!isVisible) {
      const hiddenLocationUser = await User.findByIdAndUpdate(
        req.userId,
        {
          $set: {
            "chatLocation.isVisible": false,
            "chatLocation.latitude": null,
            "chatLocation.longitude": null,
            "chatLocation.updatedAt": new Date(),
          },
        },
        { new: true },
      )
        .select("chatLocation")
        .lean();

      if (!hiddenLocationUser) {
        return res.status(404).json({ message: "User not found." });
      }

      return res.json({
        message: "Location sharing is off.",
        location: toLocationPayload(hiddenLocationUser),
      });
    }

    const nextLatitude = normalizeCoordinate(latitude);
    const nextLongitude = normalizeCoordinate(longitude);

    if (!Number.isFinite(nextLatitude) || nextLatitude < -90 || nextLatitude > 90) {
      return res.status(400).json({ message: "Latitude must be a valid number between -90 and 90." });
    }

    if (!Number.isFinite(nextLongitude) || nextLongitude < -180 || nextLongitude > 180) {
      return res.status(400).json({ message: "Longitude must be a valid number between -180 and 180." });
    }

    const visibleLocationUser = await User.findByIdAndUpdate(
      req.userId,
      {
        $set: {
          "chatLocation.isVisible": true,
          "chatLocation.latitude": nextLatitude,
          "chatLocation.longitude": nextLongitude,
          "chatLocation.updatedAt": new Date(),
        },
      },
      { new: true },
    )
      .select("chatLocation")
      .lean();

    if (!visibleLocationUser) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json({
      message: "Location shared with travelers.",
      location: toLocationPayload(visibleLocationUser),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
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
  updateLocation,
};
