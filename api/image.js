import analyzeImage from "../sightengine.js";
import formatResult from "../formatter.js";
import { validateKey } from "../lib/keys.js";
import { trackUsage } from "../lib/usage.js";

const setCors = (res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, x-api-key"
  );
};

export default async function handler(req, res) {
  setCors(res);

  // handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // only POST allowed
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Only POST allowed",
    });
  }

  try {
    // API KEY CHECK
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: "Missing API Key",
      });
    }

    // VALIDATE KEY FROM SUPABASE
    const isValid = await validateKey(apiKey);

    if (!isValid) {
      return res.status(403).json({
        success: false,
        message: "Invalid API Key",
      });
    }
await trackUsage(apiKey);
    // IMAGE INPUT
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "imageUrl is required",
      });
    }

    // AI ANALYSIS (Sightengine)
    const raw = await analyzeImage(imageUrl);

    // FORMAT RESULT
    const report = formatResult(raw);

    // RESPONSE
    return res.status(200).json({
      success: true,
      provider: "TNet API",
      reportId: `TNET_${Date.now()}`,
      report,
    });

  } catch (err) {
    console.error("Image API Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
}
