import { createClient } from "@supabase/supabase-js";
import formidable from "formidable";
import fs from "fs/promises";

export const config = {
  api: {
    bodyParser: false,
  },
};

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-api-key");
}

const parseForm = (req) => {
  const form = formidable({
    multiples: false,
    keepExtensions: true,
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

export default async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { files } = await parseForm(req);

    const uploadedFile = Array.isArray(files.file)
      ? files.file[0]
      : files.file;

    if (!uploadedFile) {
      return res.status(400).json({
        error: "No file uploaded",
      });
    }

    const buffer = await fs.readFile(uploadedFile.filepath);

    const fileName = `tnet-${Date.now()}-${uploadedFile.originalFilename}`;

    const { error } = await supabase.storage
      .from("tnet-image")
      .upload(fileName, buffer, {
        contentType: uploadedFile.mimetype,
        upsert: false,
      });

    if (error) {
      console.error("SUPABASE UPLOAD ERROR:", error);

      return res.status(500).json({
        error: error.message,
      });
    }

    const { data } = supabase.storage
      .from("tnet-images")
      .getPublicUrl(fileName);

    return res.status(200).json({
      success: true,
      secure_url: data.publicUrl,
      fileName,
    });

  } catch (error) {

    console.error("UPLOAD ERROR:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
}
