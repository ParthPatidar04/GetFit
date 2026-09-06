import express from "express";
import {
  createOrder,
  verifyPayment,
  getSubscriptionStatus,
} from "../controllers/payment.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);
router.get("/status", getSubscriptionStatus);

export default router;