import jwt from "jsonwebtoken";
import User from "../models/User.js";

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-passwordHash");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // session expiry: 3 days of zero activity
    const inactiveFor = Date.now() - new Date(user.lastActiveAt).getTime();
    if (inactiveFor > THREE_DAYS_MS) {
      return res.status(401).json({ message: "Session expired due to inactivity, please log in again" });
    }

    // refresh last activity
    user.lastActiveAt = new Date();
    await user.save();

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};