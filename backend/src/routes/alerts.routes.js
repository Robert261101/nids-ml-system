import express from "express";
import {
  getAlertsHandler,
  getAlertByIdHandler,
} from "../controllers/alerts.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/rbac.middleware.js";

const router = express.Router();

router.get("/alerts", requireAuth, requireRole("analyst"), getAlertsHandler);
router.get("/alerts/:id", requireAuth, requireRole("analyst"), getAlertByIdHandler);

export default router;