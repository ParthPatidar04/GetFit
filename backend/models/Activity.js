import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true }, // normalized to midnight, one "day" of activity
    type: { type: String, enum: ["workout", "water", "steps", "custom"], default: "workout" },
    value: { type: Number, default: 1 }, // e.g. reps, glasses, km — optional detail
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

// speeds up heatmap queries (all entries for a user, sorted by date)
activitySchema.index({ user: 1, date: 1 });

export default mongoose.model("Activity", activitySchema);