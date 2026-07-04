import analyzeImage from "../sightengine.js";
import formatResult from "../formatter.js";
import { validateKey } from "../lib/keys.js";

const setCors = (res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-api-key");
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({ message: "Missing API Key" });
  }

  const isValid = await validateKey(apiKey);

  if (!isValid) {
    return res.status(403).json({ message: "Invalid API Key" });
  }

  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ message: "imageUrl is required" });
  }

  const raw = await analyzeImage(imageUrl);
  const report = formatResult(raw);

  return res.status(200).json({
    success: true,
    provider: "TNet API",
    reportId: `TNET_${Date.now()}`,
    report
  });
}
