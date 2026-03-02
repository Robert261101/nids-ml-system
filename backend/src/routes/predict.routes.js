import express from "express";
import { predictHandler } from "../controllers/predict.controller.js";
import { uploadSingleCsv } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/predict", uploadSingleCsv, predictHandler);

export default router;