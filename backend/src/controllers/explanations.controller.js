import { getExplanationForPrediction } from "../services/explanations.service.js";

export async function getExplanationForPredictionHandler(req, res) {
  try {
    const predictionId = Number(req.params.predictionId);

    if (!Number.isInteger(predictionId) || predictionId <= 0) {
      return res.status(400).json({ error: "Invalid prediction id" });
    }

    const result = await getExplanationForPrediction(predictionId);
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error("getExplanationForPredictionHandler error:", err);
    return res.status(500).json({ error: "Failed to fetch explanation" });
  }
}