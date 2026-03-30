import { query } from "../db/index.js";

export async function getExplanationForPrediction(predictionId) {
  const predictionResult = await query(
    `SELECT id, explanation_sample_json
     FROM predictions
     WHERE id = $1
     LIMIT 1`,
    [predictionId]
  );

  const prediction = predictionResult.rows[0];

  if (!prediction) {
    return { status: 404, body: { error: "Prediction not found" } };
  }

  if (!prediction.explanation_sample_json) {
    return { status: 404, body: { error: "No explanation sample stored for this prediction" } };
  }

  const mlServiceUrl = process.env.ML_SERVICE_URL || "http://ml-service:8000";

  const response = await fetch(`${mlServiceUrl}/explain`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      features: prediction.explanation_sample_json,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`ML explain request failed: ${response.status} ${text}`);
  }

  const explanation = await response.json();

  return {
    status: 200,
    body: {
      predictionId: prediction.id,
      explanation,
    },
  };
}