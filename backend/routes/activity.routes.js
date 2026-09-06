import express from "express";
import {
  createActivity,
  getActivities,
  getHeatmapData,
  getOverview,
  deleteActivity,
} from "../controllers/activity.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createActivity);
router.get("/", getActivities);
router.get("/heatmap", getHeatmapData);
router.get("/overview", getOverview);
router.delete("/:id", deleteActivity);

export default router;