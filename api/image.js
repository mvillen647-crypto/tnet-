import analyzeImage from "../sightengine.js";
import formatResult from "../formatter.js";

export default async function handler(req, res) {
  // Ruhusu POST pekee
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  try {
    const { imageUrl } = req.body;

    // Hakikisha imageUrl ipo
    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "imageUrl is required",
      });
    }

    const raw = await analyzeImage(imageUrl);
const result = formatResult(raw);
    //rudisha majibu

return res.status(200).json({
  success: true,
  provider: "TNet Intelligence Engine",
  report: result,
});
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
      }
