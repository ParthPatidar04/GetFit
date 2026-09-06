import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import adminAuth from "../config/firebase-admin.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// @route POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, passwordHash });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    user.lastActiveAt = new Date();
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      theme: user.theme,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/auth/me
export const getMe = async (req, res) => {
  res.json(req.user);
};

// @route POST /api/auth/firebase
// body: { idToken } -- the Firebase ID token from the frontend after Google sign-in
export const firebaseLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: "idToken is required" });
    }

    const decoded = await adminAuth.verifyIdToken(idToken);
    const { uid, email, name, picture } = decoded;

    let user = await User.findOne({ $or: [{ firebaseUid: uid }, { email }] });

    if (!user) {
      user = await User.create({
        name: name || email.split("@")[0],
        email,
        firebaseUid: uid,
        avatarUrl: picture || "",
      });
    } else if (!user.firebaseUid) {
      // existing email/password user signing in with Google for the first time
      user.firebaseUid = uid;
      await user.save();
    }

    user.lastActiveAt = new Date();
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      theme: user.theme,
      subscriptionStatus: user.subscriptionStatus,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(401).json({ message: "Firebase authentication failed" });
  }
};