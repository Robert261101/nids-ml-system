import { callMLService } from "../services/ml.service.js";

export const predictHandler = async (req, res) => {
  try {
    const data = req.body;

    const result = await callMLService(data);

    res.json(result);
  } catch (error) {
    console.error("Prediction error:", error.message);
    res.status(500).json({ error: "Prediction failed" });
  }
};