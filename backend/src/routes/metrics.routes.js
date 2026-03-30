import express from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/rbac.middleware.js";
import {
  getSummaryMetricsHandler,
  getTimelineMetricsHandler,
  getSeverityDistributionHandler,
  getMitreTacticDistributionHandler,
} from "../controllers/metrics.controller.js";

const router = express.Router();

router.get("/metrics/summary", requireAuth, requireRole("analyst"), getSummaryMetricsHandler);
router.get("/metrics/timeseries", requireAuth, requireRole("analyst"), getTimelineMetricsHandler);
router.get("/metrics/severity", requireAuth, requireRole("analyst"), getSeverityDistributionHandler);
router.get("/metrics/mitre-tactics", requireAuth, requireRole("analyst"), getMitreTacticDistributionHandler);

export default router;