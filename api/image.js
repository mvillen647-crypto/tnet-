import analyzeImage from "../sightengine.js";

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

    // Tuma image kwa Sightengine
    const result = await analyzeImage(imageUrl);

    // Rudisha response ya TNet
    return res.status(200).json({
      success: true,
      provider: "TNet",
      data: result,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
      }
