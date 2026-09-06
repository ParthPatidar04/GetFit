import mongoose from "mongoose";

const dietPlanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bodyTypeSnapshot: { type: String, default: "" },
    goalSnapshot: { type: String, default: "" },
    heightSnapshot: { type: Number, default: null },
    weightSnapshot: { type: Number, default: null },
    suggestion: { type: String, required: true }, // raw AI-generated diet plan text
  },
  { timestamps: true }
);

export default mongoose.model("DietPlan", dietPlanSchema);