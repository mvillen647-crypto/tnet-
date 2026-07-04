export default function formatResult(raw) {
  const nudity = raw?.nudity || {};
  const weapon = raw?.weapon || {};
  const scam = raw?.scam || {};
  const offensive = raw?.offensive || {};

  // simple risk calculation (MVP logic)
  let riskScore = 0;

  if (nudity?.safe < 0.7) riskScore += 30;
  if (weapon?.prob > 0.3) riskScore += 25;
  if (scam?.prob > 0.3) riskScore += 25;
  if (offensive?.prob > 0.3) riskScore += 20;

  let riskLevel = "Low";
  let recommendation = "Safe";

  if (riskScore >= 50) {
    riskLevel = "High";
    recommendation = "Block";
  } else if (riskScore >= 20) {
    riskLevel = "Medium";
    recommendation = "Review";
  }

  return {
    trustScore: Math.max(0, 100 - riskScore),
    riskLevel,
    recommendation,
    detections: {
      nudity: nudity?.safe ?? null,
      weapon: weapon?.prob ?? null,
      scam: scam?.prob ?? null,
      offensive: offensive?.prob ?? null,
    },
    raw
  };
                         }
