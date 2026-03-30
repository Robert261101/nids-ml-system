import fs from "fs/promises";
import { mlPredictCsv } from "../services/ml.service.js";
import { query } from "../db/index.js";
import { generateAlert } from "../services/alert.service.js";

export const predictHandler = async (req, res) => {
  const filePath = req.file?.path;

  if (!filePath) {
    return res.status(400).json({ error: "CSV file is required" });
  }

  try {
    const result = await mlPredictCsv(filePath);
    console.log(`[${req.requestId}] predict csv ok`);

    const requestId = req.requestId;
    const fileName = req.file?.originalname || null;

    const preds = Array.isArray(result?.predictions) ? result.predictions : [];
    const rows = preds.length;

    let attacks = 0;
    let benign = 0;

    for (const p of preds) {
      const v = typeof p === "object" ? (p.label ?? p.prediction ?? p.class) : p;
      if (v === 1 || v === "ATTACK" || v === "attack" || v === true) attacks++;
      else benign++;
    }

    const resultDb = await query(
      `INSERT INTO predictions (request_id, model_version, input_filename, rows, attacks_count, benign_count, output_json, explanation_sample_json)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING id`,
      [
        requestId,
        process.env.MODEL_VERSION || "unknown",
        fileName,
        rows,
        attacks,
        benign,
        JSON.stringify(result),
        JSON.stringify(explanationSample),
      ]
    );

    const predictionId = resultDb.rows[0].id;

    console.log("attacks:", attacks, "benign:", benign);  
    await generateAlert(predictionId, {
      attacks_count: attacks,
      benign_count: benign
    });

    return res.json(result);
  } catch (error) {
    console.error(`[${req.requestId}] predict csv fail`, error);
    return res.status(500).json({ error: "Prediction failed" });
  } finally {
    try {
      await fs.unlink(filePath);
    } catch (_) {}
  }
};