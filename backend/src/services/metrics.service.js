import { query } from "../db/index.js";

export async function getSummaryMetrics() {
  const totalPredictionsResult = await query(
    `SELECT COUNT(*)::int AS total_predictions FROM predictions`
  );

  const totalAlertsResult = await query(
    `SELECT COUNT(*)::int AS total_alerts FROM alerts`
  );

  const totalsResult = await query(
    `SELECT
       COALESCE(SUM(attacks_count), 0)::int AS total_attack_rows,
       COALESCE(SUM(benign_count), 0)::int AS total_benign_rows
     FROM predictions`
  );

  const highSeverityAlertsResult = await query(
    `SELECT COUNT(*)::int AS high_severity_alerts
     FROM alerts
     WHERE severity = 'high'`
  );

  return {
    totalPredictions: totalPredictionsResult.rows[0].total_predictions,
    totalAlerts: totalAlertsResult.rows[0].total_alerts,
    totalAttackRows: totalsResult.rows[0].total_attack_rows,
    totalBenignRows: totalsResult.rows[0].total_benign_rows,
    highSeverityAlerts: highSeverityAlertsResult.rows[0].high_severity_alerts,
  };
}

export async function getAlertTimeline() {
  const result = await query(
    `SELECT
       DATE(created_at) AS date,
       COUNT(*)::int AS count
     FROM alerts
     GROUP BY DATE(created_at)
     ORDER BY DATE(created_at) ASC`
  );

  return result.rows;
}

export async function getSeverityDistribution() {
  const result = await query(
    `SELECT
       severity,
       COUNT(*)::int AS count
     FROM alerts
     GROUP BY severity
     ORDER BY severity ASC`
  );

  return result.rows;
}

export async function getMitreTacticDistribution() {
  const result = await query(
    `SELECT
       tactic,
       COUNT(*)::int AS count
     FROM (
       SELECT unnest(mitre_tactics) AS tactic
       FROM alerts
       WHERE mitre_tactics IS NOT NULL
     ) t
     GROUP BY tactic
     ORDER BY count DESC, tactic ASC`
  );

  return result.rows;
}