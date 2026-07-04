import analyzeImage from "../sightengine.js";
import formatResult from "../formatter.js";

const validApiKeys = [
  "tnet_free_12345",
  "tnet_admin_99999"
];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Only POST allowed",
    });
  }

  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: "Missing API Key",
    });
  }

  if (!validApiKeys.includes(apiKey)) {
    return res.status(403).json({
      success: false,
      message: "Invalid API Key",
    });
  }

  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "imageUrl is required",
      });
    }

    const raw = await analyzeImage(imageUrl);
    const report = formatResult(raw);

    return res.status(200).json({
      success: true,
      provider: "TNet API",
      apiKey: apiKey,
      reportId: `TNET_${Date.now()}`,
      report,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
