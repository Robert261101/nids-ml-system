import { query } from "../db/index.js";
import { mapPredictionToMitre } from "../security/mitre/mapping.js";

export async function generateAlert(predictionId, summary) {
  const mitre = mapPredictionToMitre(summary);

  if (!mitre) return;

  await query(
    `INSERT INTO alerts (prediction_id, severity, mitre_tactics, mitre_techniques, summary)
     VALUES ($1, $2, $3, $4, $5)`,
    [
      predictionId,
      mitre.severity,
      mitre.tactics,
      mitre.techniques,
      mitre.summary
    ]
  );
}