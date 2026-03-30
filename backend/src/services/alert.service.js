import { query } from "../db/index.js";
import { mapPredictionToMitre } from "../security/mitre/mapping.js";

export async function generateAlert(predictionId, summary) {
  console.log("generateAlert called:", predictionId, summary);

  const mitre = mapPredictionToMitre(summary);
  console.log("MITRE result:", mitre);
  
  if (!mitre) {
    console.log("No MITRE mapping → skipping insert");
    return;
  }

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
  console.log("Alert inserted");
}

export async function getAlerts({ limit = 20, offset = 0, severity } = {}) {
  const values = [];
  let whereClause = "";

  if (severity) {
    values.push(severity);
    whereClause = `WHERE a.severity = $${values.length}`;
  }

  values.push(limit);
  const limitPlaceholder = `$${values.length}`;

  values.push(offset);
  const offsetPlaceholder = `$${values.length}`;

  const sql = `
    SELECT
      a.id,
      a.prediction_id,
      a.created_at,
      a.severity,
      a.mitre_tactics,
      a.mitre_techniques,
      a.explanation_row_index,
      a.summary,
      p.model_version,
      p.input_filename,
      p.rows,
      p.attacks_count,
      p.benign_count
    FROM alerts a
    JOIN predictions p ON p.id = a.prediction_id
    ${whereClause}
    ORDER BY a.created_at DESC
    LIMIT ${limitPlaceholder}
    OFFSET ${offsetPlaceholder}
  `;

  const result = await query(sql, values);
  return result.rows;
}

export async function getAlertById(id) {
  const sql = `
    SELECT
      a.id,
      a.prediction_id,
      a.created_at,
      a.severity,
      a.mitre_tactics,
      a.mitre_techniques,
      a.explanation_row_index,
      a.summary,
      p.request_id,
      p.model_version,
      p.input_filename,
      p.rows,
      p.attacks_count,
      p.benign_count,
      p.output_json,
      p.explanation_sample_json
    FROM alerts a
    JOIN predictions p ON p.id = a.prediction_id
    WHERE a.id = $1
    LIMIT 1
  `;

  const result = await query(sql, [id]);
  return result.rows[0] || null;
}