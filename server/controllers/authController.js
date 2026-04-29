const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");

const googleClient = new OAuth2Client();

const signToken = (userId) => jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

const serializeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role || "user",
});

const getGoogleAudiences = () =>
  (process.env.GOOGLE_CLIENT_ID || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already in use." });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    res.status(201).json({ token: signToken(user._id), user: serializeUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    if (!user.password) {
      return res.status(400).json({ message: "This account uses Google sign-in." });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    res.json({ token: signToken(user._id), user: serializeUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "Google credential is required." });
    }

    const audiences = getGoogleAudiences();
    if (!audiences.length) {
      return res.status(500).json({ message: "Google sign-in is not configured." });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: audiences,
    });
    const payload = ticket.getPayload();

    if (!payload?.email || !payload.email_verified) {
      return res.status(400).json({ message: "Google account email could not be verified." });
    }

    let user = await User.findOne({ email: payload.email });

    if (user && user.googleId && payload.sub && user.googleId !== payload.sub) {
      return res.status(400).json({ message: "This email is already linked to another Google account." });
    }

    if (!user) {
      const fallbackName = payload.name || payload.given_name || payload.email.split("@")[0];
      user = await User.create({
        name: fallbackName,
        email: payload.email,
        googleId: payload.sub,
      });
    } else {
      let shouldSave = false;

      if (!user.googleId && payload.sub) {
        user.googleId = payload.sub;
        shouldSave = true;
      }

      if (!user.name && payload.name) {
        user.name = payload.name;
        shouldSave = true;
      }

      if (shouldSave) {
        await user.save();
      }
    }

    res.json({ token: signToken(user._id), user: serializeUser(user) });
  } catch (err) {
    res.status(401).json({ message: "Google sign-in failed." });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json({ ...user.toObject(), role: user.role || "user" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login, googleLogin, getMe };
