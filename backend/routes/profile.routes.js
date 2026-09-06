import express from "express";
import {
  updateProfile,
  uploadAvatar,
  setPresetAvatar,
  deleteAvatar,
} from "../controllers/profile.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.use(protect);

router.put("/", updateProfile);
router.post("/avatar/upload", upload.single("avatar"), uploadAvatar);
router.put("/avatar/preset", setPresetAvatar);
router.delete("/avatar", deleteAvatar);

export default router;