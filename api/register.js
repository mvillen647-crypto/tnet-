import { db } from "../lib/db.js";

function generateKey() {
  return "tnet_" + Math.random().toString(36).substring(2, 15);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  try {
    const apiKey = generateKey();

    const { error } = await db
      .from("api_keys")
      .insert([{ api_key: apiKey }]);

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      apiKey: apiKey,
    });

  } catch (err) {
  console.error(err);

  return res.status(500).json({
    success: false,
    message: err.message,
    stack: err.stack
  });
  }
}
