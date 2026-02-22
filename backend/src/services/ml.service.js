import axios from "axios";

export const callMLService = async (data) => {
  const ML_URL = process.env.ML_SERVICE_URL;

  if (!ML_URL) {
    throw new Error("ML_SERVICE_URL is missing in backend/.env");
  }

  const response = await axios.post(`${ML_URL}/predict`, data, {
    headers: { "Content-Type": "application/json" },
  });

  return response.data;
};