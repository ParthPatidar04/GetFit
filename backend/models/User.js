import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: false }, // not required if user signs in via Firebase
    firebaseUid: { type: String, default: null },

    avatarUrl: { type: String, default: "" },

    bodyType: { type: String, enum: ["ectomorph", "mesomorph", "endomorph", ""], default: "" },
    height: { type: Number, default: null }, // cm
    weight: { type: Number, default: null }, // kg
    goal: { type: String, enum: ["lose_weight", "gain_muscle", "maintain", ""], default: "" },
    dietPreference: { type: String, enum: ["vegetarian", "non-vegetarian", "eggetarian", ""], default: "" },

    theme: { type: String, enum: ["light", "dark"], default: "light" },

    lastActiveAt: { type: Date, default: Date.now },

    subscriptionStatus: { type: String, enum: ["free", "active", "expired"], default: "free" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);