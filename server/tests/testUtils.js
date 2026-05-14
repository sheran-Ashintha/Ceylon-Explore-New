const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const path = require("path");
const User = require("../models/User");

let userCounter = 0;

dotenv.config({ path: path.resolve(__dirname, "../.env") });

function getBaseMongoUri() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is required to run the backend test suite.");
  }

  return process.env.MONGO_URI;
}

function getTestMongoUri() {
  const baseUri = getBaseMongoUri();
  const parsedUri = new URL(baseUri);
  const currentDatabaseName = parsedUri.pathname && parsedUri.pathname !== "/"
    ? parsedUri.pathname.slice(1)
    : "ceylon-explore";
  const testDatabaseName = `${currentDatabaseName}-integration-test`;

  parsedUri.pathname = `/${testDatabaseName}`;

  const testUri = parsedUri.toString();

  if (testUri === baseUri) {
    throw new Error("Refusing to run tests against the primary Mongo database URI.");
  }

  return testUri;
}

async function startTestDatabase() {
  process.env.NODE_ENV = "test";
  process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  await mongoose.connect(getTestMongoUri());
  await mongoose.connection.db.dropDatabase();
}

async function clearTestDatabase() {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.db.dropDatabase();
  }
}

async function stopTestDatabase() {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.db.dropDatabase();
  }

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}

async function createUser(overrides = {}) {
  userCounter += 1;

  const plainPassword = overrides.password ?? "password123";
  const userData = {
    name: overrides.name || `Test User ${userCounter}`,
    email: overrides.email || `user${userCounter}@example.com`,
    role: overrides.role || "user",
    friends: overrides.friends || [],
    friendRequestsReceived: overrides.friendRequestsReceived || [],
    friendRequestsSent: overrides.friendRequestsSent || [],
  };

  if (overrides.googleId) {
    userData.googleId = overrides.googleId;
  }

  if (overrides.password !== null) {
    userData.password = await bcrypt.hash(plainPassword, 10);
  }

  if (overrides.chatLocation) {
    userData.chatLocation = overrides.chatLocation;
  }

  const user = await User.create(userData);

  return {
    user,
    password: plainPassword,
  };
}

function signTestToken(user) {
  return jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

module.exports = {
  clearTestDatabase,
  createUser,
  signTestToken,
  startTestDatabase,
  stopTestDatabase,
};