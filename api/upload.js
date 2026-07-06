import { createClient } from "@supabase/supabase-js";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: { bodyParser: false },
};

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const cors = (res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-api-key");
};

export default async function handler(req, res) {
  cors(res);

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      cors(res);
      return res.status(500).json({ error: err.message });
    }

    try {
      const file = files.file;
      if (!file) {
        return res.status(400).json({ error: "No file" });
      }

      const buffer = fs.readFileSync(file.filepath);
      const fileName = `tnet-${Date.now()}-${file.originalFilename}`;

      const { error } = await supabase.storage
        .from("tnet-images")
        .upload(fileName, buffer, {
          contentType: file.mimetype,
        });

      if (error) throw error;

      const { data } = supabase.storage
        .from("tnet-images")
        .getPublicUrl(fileName);

      return res.status(200).json({
        secure_url: data.publicUrl,
      });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  });
                                             }
