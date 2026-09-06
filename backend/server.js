import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import activityRoutes from "./routes/activity.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import dietRoutes from "./routes/diet.routes.js";
import paymentRoutes from "./routes/payment.routes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/diet", dietRoutes);
app.use("/api/payment", paymentRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));