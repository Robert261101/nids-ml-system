import { getAlerts, getAlertById } from "../services/alert.service.js";

export async function getAlertsHandler(req, res) {
  try {
    const limit = Math.max(1, Math.min(parseInt(req.query.limit || "20", 10), 100));
    const offset = Math.max(0, parseInt(req.query.offset || "0", 10));
    const severity = req.query.severity ? String(req.query.severity).trim() : undefined;

    const alerts = await getAlerts({ limit, offset, severity });

    return res.status(200).json({
      items: alerts,
      pagination: {
        limit,
        offset,
        count: alerts.length,
      },
    });
  } catch (err) {
    console.error("getAlertsHandler error:", err);
    return res.status(500).json({ error: "Failed to fetch alerts" });
  }
}

export async function getAlertByIdHandler(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid alert id" });
    }

    const alert = await getAlertById(id);

    if (!alert) {
      return res.status(404).json({ error: "Alert not found" });
    }

    return res.status(200).json(alert);
  } catch (err) {
    console.error("getAlertByIdHandler error:", err);
    return res.status(500).json({ error: "Failed to fetch alert" });
  }
}