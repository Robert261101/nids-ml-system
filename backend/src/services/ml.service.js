import axios from "axios";
import fs from "fs";
import FormData from "form-data";

const ML_URL = process.env.ML_SERVICE_URL;

export const mlPredictCsv = async (filePath) => {
  if (!ML_URL) {
    throw new Error("ML_SERVICE_URL is missing in backend/.env");
  }

  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));

  const response = await axios.post(`${ML_URL}/predict/csv`, form, {
    headers: form.getHeaders(),
    timeout: 15000,          // 15s
    maxBodyLength: Infinity, // allow streaming
    maxContentLength: Infinity,
  });

  return response.data;
};