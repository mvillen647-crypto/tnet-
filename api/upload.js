import { createClient } from "@supabase/supabase-js";
import formidable from "formidable";
import fs from "fs";

const setCors = (res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, x-api-key"
  );
};


export const config = {
  api: {
    bodyParser: false,
  },
};

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Form parse error" });
    }

    try {
      const file = files.file;
      const fileBuffer = fs.readFileSync(file.filepath);

      const fileName = `tnet-${Date.now()}-${file.originalFilename}`;

      const { data, error } = await supabase.storage
        .from("tnet-images")
        .upload(fileName, fileBuffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      const { data: publicUrl } = supabase.storage
        .from("tnet-images")
        .getPublicUrl(fileName);

      return res.status(200).json({
        secure_url: publicUrl.publicUrl,
      });
    } catch (e) {
      return res.status(500).json({ error: "Upload failed" });
    }
  });
          }
