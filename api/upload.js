export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-api-key");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) throw err;

      const file = files.file;
      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileBuffer = fs.readFileSync(file.filepath);
      const fileName = `tnet-${Date.now()}-${file.originalFilename}`;

      const { error } = await supabase.storage
        .from("tnet-images")
        .upload(fileName, fileBuffer, {
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
