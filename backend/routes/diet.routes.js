import express from "express";
import { generateDietPlan, getDietHistory, chatAboutDiet } from "../controllers/diet.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/generate", generateDietPlan);
router.get("/history", getDietHistory);
router.post("/chat", chatAboutDiet);

export default router;