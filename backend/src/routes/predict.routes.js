import express from "express";
import { predictHandler } from "../controllers/predict.controller.js";
import { uploadSingleCsv } from "../middlewares/upload.middleware.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/rbac.middleware.js";

const router = express.Router();

router.post("/predict", requireAuth, requireRole("analyst"), uploadSingleCsv, predictHandler);

export default router;