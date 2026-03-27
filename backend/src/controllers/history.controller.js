import { query } from "../db/index.js";

export async function getPredictions(req, res) {
  try {
    const result = await query(
      `SELECT id, created_at, rows, attacks_count, benign_count
       FROM predictions
       ORDER BY created_at DESC
       LIMIT 50`
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching predictions:", err);
    res.status(500).json({ error: "Failed to fetch predictions" });
  }
}

export async function getPredictionById(req, res) {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT * FROM predictions WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Prediction not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching prediction:", err);
    res.status(500).json({ error: "Failed to fetch prediction" });
  }
}

export async function getAlerts(req, res) {
  try {
    const result = await query(
      `SELECT id, prediction_id, severity, summary, created_at
       FROM alerts
       ORDER BY created_at DESC
       LIMIT 50`
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching alerts:", err);
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
}