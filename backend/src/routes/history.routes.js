import express from "express";
import {
  getPredictions,
  getPredictionById,
  getAlerts
} from "../controllers/history.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/rbac.middleware.js";

const router = express.Router();

router.get("/predictions", requireAuth, requireRole("viewer"), getPredictions);
router.get("/predictions/:id", requireAuth, requireRole("viewer"), getPredictionById);
router.get("/alerts", requireAuth, requireRole("viewer"), getAlerts);

export default router;