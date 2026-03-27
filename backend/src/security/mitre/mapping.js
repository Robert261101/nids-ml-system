export function mapPredictionToMitre(predictionSummary) {
  const { attacks_count, benign_count } = predictionSummary;

  if (attacks_count === 0) {
    return null;
  }

  return {
    severity: attacks_count > 10 ? "high" : "medium",
    tactics: ["Reconnaissance", "Discovery"],
    techniques: ["T1046"], // Network Service Scanning
    summary: `Detected ${attacks_count} suspicious flows`
  };
}