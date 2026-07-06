import { createClient } from "@supabase/supabase-js";
import formidable from "formidable";
import fs from "fs";

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
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, x-api-key"
  );
}

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

  const form = formidable({
    multiples: false,
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        console.error(err);
        return res.status(500).json({
          error: err.message,
        });
      }

      const uploadedFile = Array.isArray(files.file)
        ? files.file[0]
        : files.file;

      if (!uploadedFile) {
        return res.status(400).json({
          error: "No file uploaded",
        });
      }

      const buffer = fs.readFileSync(uploadedFile.filepath);

      const fileName =
        "tnet-" +
        Date.now() +
        "-" +
        uploadedFile.originalFilename;

      const { error: uploadError } =
        await supabase.storage
          .from("tnet-image")
          .upload(fileName, buffer, {
            contentType: uploadedFile.mimetype,
            upsert: false,
          });

      if (uploadError) {
        console.error(uploadError);

        return res.status(500).json({
          error: uploadError.message,
        });
      }

      const { data } = supabase.storage
        .from("tnet-image")
        .getPublicUrl(fileName);

      if (!data?.publicUrl) {
        return res.status(500).json({
          error: "Failed to create public URL",
        });
      }

      return res.status(200).json({
        success: true,
        secure_url: data.publicUrl,
        fileName,
      });

    } catch (e) {
      console.error(e);

      return res.status(500).json({
        error: e.message,
      });
    }
  });
}
