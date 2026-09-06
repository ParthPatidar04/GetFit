import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String, default: null },
    amount: { type: Number, required: true }, // in paise
    status: { type: String, enum: ["created", "paid", "failed"], default: "created" },
    plan: { type: String, default: "monthly" },
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", subscriptionSchema);