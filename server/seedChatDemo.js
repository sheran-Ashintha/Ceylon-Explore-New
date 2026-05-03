require("dotenv").config();

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const ChatMessage = require("./models/ChatMessage");
const User = require("./models/User");

const DEMO_PASSWORD = String(process.env.DEMO_CHAT_PASSWORD || "Demo12345!").trim();

const DEMO_USERS = [
  {
    name: "Nimal Colombo",
    email: "demo.colombo@ceylonexplore.local",
    area: "Colombo",
    latitude: 6.9271,
    longitude: 79.8612,
    message: "Hi all, I am online in Colombo right now.",
  },
  {
    name: "Sithara Kandy",
    email: "demo.kandy@ceylonexplore.local",
    area: "Kandy",
    latitude: 7.2906,
    longitude: 80.6337,
    message: "Greetings from Kandy. Anyone nearby planning day tours?",
  },
  {
    name: "Ravin Galle",
    email: "demo.galle@ceylonexplore.local",
    area: "Galle",
    latitude: 6.0535,
    longitude: 80.221,
    message: "Available from Galle Fort area for chat.",
  },
  {
    name: "Tharushi Jaffna",
    email: "demo.jaffna@ceylonexplore.local",
    area: "Jaffna",
    latitude: 9.6615,
    longitude: 80.0255,
    message: "Hello from Jaffna. Looking for food and culture tips.",
  },
  {
    name: "Dinuka Ella",
    email: "demo.ella@ceylonexplore.local",
    area: "Ella",
    latitude: 6.8667,
    longitude: 81.0466,
    message: "I am near Ella. Great weather for a hike today.",
  },
  {
    name: "Piumi Trincomalee",
    email: "demo.trinco@ceylonexplore.local",
    area: "Trincomalee",
    latitude: 8.5874,
    longitude: 81.2152,
    message: "Checking in from Trincomalee beaches.",
  },
];

async function ensureDemoUsers() {
  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);
  const now = new Date();
  const usersByEmail = new Map();

  for (const entry of DEMO_USERS) {
    const update = {
      $set: {
        name: entry.name,
        role: "user",
        password: hashedPassword,
        chatLocation: {
          isVisible: true,
          latitude: entry.latitude,
          longitude: entry.longitude,
          updatedAt: now,
        },
      },
      $setOnInsert: {
        email: entry.email,
      },
    };

    const user = await User.findOneAndUpdate({ email: entry.email }, update, {
      returnDocument: "after",
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    });

    usersByEmail.set(entry.email, user);
  }

  const demoUsers = Array.from(usersByEmail.values());
  const demoUserIds = demoUsers.map((user) => user._id);

  for (const user of demoUsers) {
    const otherIds = demoUserIds.filter((id) => String(id) !== String(user._id));

    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          friends: otherIds,
          friendRequestsReceived: [],
          friendRequestsSent: [],
        },
      },
    );
  }

  return usersByEmail;
}

async function seedDemoMessages(usersByEmail) {
  const demoUserIds = Array.from(usersByEmail.values()).map((user) => user._id);
  await ChatMessage.deleteMany({ sender: { $in: demoUserIds } });

  const now = Date.now();
  const docs = DEMO_USERS.map((entry, index) => {
    const sender = usersByEmail.get(entry.email);
    const timestamp = new Date(now - (DEMO_USERS.length - index) * 60 * 1000);

    return {
      sender: sender._id,
      body: entry.message,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  });

  await ChatMessage.insertMany(docs);
}

async function main() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is required.");
  }

  if (DEMO_PASSWORD.length < 6) {
    throw new Error("DEMO_CHAT_PASSWORD must be at least 6 characters.");
  }

  await mongoose.connect(process.env.MONGO_URI);

  try {
    const usersByEmail = await ensureDemoUsers();
    await seedDemoMessages(usersByEmail);

    console.log("Chat demo users are ready.");
    console.log(`Password for all demo users: ${DEMO_PASSWORD}`);
    console.table(
      DEMO_USERS.map((entry) => ({
        name: entry.name,
        email: entry.email,
        area: entry.area,
        coordinates: `${entry.latitude}, ${entry.longitude}`,
      })),
    );
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
