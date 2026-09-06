import genAI from "../config/gemini.js";
import DietPlan from "../models/DietPlan.js";

// @route POST /api/diet/generate
export const generateDietPlan = async (req, res) => {
  try {
    const { bodyType, height, weight, goal } = req.user;

    if (!bodyType || !height || !weight || !goal) {
      return res.status(400).json({
        message: "Please complete your profile (body type, height, weight, goal) first",
      });
    }

    const prompt = `You are a fitness nutrition assistant. Suggest a simple one-day diet plan
for a person with:
- Body type: ${bodyType}
- Height: ${height} cm
- Weight: ${weight} kg
- Goal: ${goal}

Give breakfast, lunch, dinner, and 1-2 snacks. Keep it practical and Indian-diet friendly.
Keep the response concise, use plain text with clear headings, no markdown symbols like ** or #.`;

    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
    const result = await model.generateContent(prompt);
    const suggestion = result.response.text();

    const dietPlan = await DietPlan.create({
      user: req.user._id,
      bodyTypeSnapshot: bodyType,
      goalSnapshot: goal,
      heightSnapshot: height,
      weightSnapshot: weight,
      suggestion,
    });

    res.status(201).json(dietPlan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/diet/history
export const getDietHistory = async (req, res) => {
  try {
    const plans = await DietPlan.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};