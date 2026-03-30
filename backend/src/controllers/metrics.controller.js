import {
  getSummaryMetrics,
  getAlertTimeline,
  getSeverityDistribution,
  getMitreTacticDistribution,
} from "../services/metrics.service.js";

export async function getSummaryMetricsHandler(req, res) {
  try {
    const summary = await getSummaryMetrics();
    return res.status(200).json(summary);
  } catch (err) {
    console.error("getSummaryMetricsHandler error:", err);
    return res.status(500).json({ error: "Failed to fetch summary metrics" });
  }
}

export async function getTimelineMetricsHandler(req, res) {
  try {
    const timeline = await getAlertTimeline();
    return res.status(200).json(timeline);
  } catch (err) {
    console.error("getTimelineMetricsHandler error:", err);
    return res.status(500).json({ error: "Failed to fetch timeline metrics" });
  }
}

export async function getSeverityDistributionHandler(req, res) {
  try {
    const severity = await getSeverityDistribution();
    return res.status(200).json(severity);
  } catch (err) {
    console.error("getSeverityDistributionHandler error:", err);
    return res.status(500).json({ error: "Failed to fetch severity distribution" });
  }
}

export async function getMitreTacticDistributionHandler(req, res) {
  try {
    const tactics = await getMitreTacticDistribution();
    return res.status(200).json(tactics);
  } catch (err) {
    console.error("getMitreTacticDistributionHandler error:", err);
    return res.status(500).json({ error: "Failed to fetch MITRE tactic distribution" });
  }
}