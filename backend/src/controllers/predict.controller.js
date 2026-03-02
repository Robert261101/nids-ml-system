import fs from "fs/promises";
import { mlPredictCsv } from "../services/ml.service.js";

export const predictHandler = async (req, res) => {
  const filePath = req.file?.path;

  if (!filePath) {
    return res.status(400).json({ error: "CSV file is required" });
  }

  try {
    const result = await mlPredictCsv(filePath);
    console.log(`[${req.requestId}] predict csv ok`);
    return res.json(result);
  } catch (error) {
    console.error("Prediction error:", error.message);
    console.error(`[${req.requestId}] predict csv fail`, error);
    return res.status(500).json({ error: "Prediction failed" });
  } finally {
    // Always delete uploaded temp file
    try {
      await fs.unlink(filePath);
    } catch (_) {}
  }
};