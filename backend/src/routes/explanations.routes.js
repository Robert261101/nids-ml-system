import express from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/rbac.middleware.js";
import { getExplanationForPredictionHandler } from "../controllers/explanations.controller.js";

const router = express.Router();

router.get("/explanations/:predictionId", requireAuth, requireRole("analyst"), getExplanationForPredictionHandler);

export default router;