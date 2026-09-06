import crypto from "crypto";
import razorpay from "../config/razorpay.js";
import Subscription from "../models/Subscription.js";

const PLAN_AMOUNT = 19900; // ₹199.00 in paise — change as you like

// @route POST /api/payment/create-order
export const createOrder = async (req, res) => {
  try {
    const order = await razorpay.orders.create({
      amount: PLAN_AMOUNT,
      currency: "INR",
      receipt: `receipt_${req.user._id}_${Date.now()}`,
    });

    await Subscription.create({
      user: req.user._id,
      razorpayOrderId: order.id,
      amount: PLAN_AMOUNT,
      status: "created",
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID, // frontend needs this to open checkout
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/payment/verify
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // recompute the signature ourselves and compare — this is what proves the
    // payment is genuine and wasn't tampered with on the frontend
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    const subscription = await Subscription.findOne({ razorpayOrderId: razorpay_order_id });
    if (!subscription) {
      return res.status(404).json({ message: "Order not found" });
    }

    subscription.status = "paid";
    subscription.razorpayPaymentId = razorpay_payment_id;
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 month subscription
    subscription.expiresAt = expiresAt;
    await subscription.save();

    req.user.subscriptionStatus = "active";
    await req.user.save();

    res.json({ message: "Payment verified", subscriptionStatus: "active" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/payment/status
export const getSubscriptionStatus = async (req, res) => {
  try {
    // auto-expire if past expiry date
    const activeSub = await Subscription.findOne({
      user: req.user._id,
      status: "paid",
    }).sort({ createdAt: -1 });

    if (activeSub && activeSub.expiresAt < new Date()) {
      req.user.subscriptionStatus = "expired";
      await req.user.save();
    }

    res.json({ subscriptionStatus: req.user.subscriptionStatus });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};