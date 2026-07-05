// api/history.js (Ama history.js kulingana na muundo wa mradi wako wa Vercel)

export default async function handler(req, res) {
  // 1. Ruhusu App yako ya simu ipate data bila kuzuiliwa (CORS Headers)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-api-key');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 2. Hakikisha njia inayotumika ni GET pekee
  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Method sio sahihi. Tumia GET" });
  }

  // 3. Soma TNetKey kutoka kwenye Headers za ombi lililotumwa
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({ error: "Huna ruhusa (Missing TNetKey/x-api-key)" });
  }

  // Hapa tunachukua credentials za Supabase kutoka kwenye Environment Variables za Vercel (Zikiwa salama)
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return res.status(500).json({ error: "Supabase Environment Variables hazijawekwa kule Vercel." });
  }

  try {
    // 4. Wasiliana na Supabase REST API kuchukua data
    // Hapa tunatafuta kwenye table ya 'scans' ambapo 'api_key_used' ni sawa na ile TNetKey ya mtumiaji
    const supabaseRes = await fetch(
      `${SUPABASE_URL}/rest/v1/scans?api_key_used=eq.${apiKey}&order=created_at.desc`,
      {
        method: "GET",
        headers: {
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (!supabaseRes.ok) {
      const errData = await supabaseRes.text();
      throw new Error(`Supabase Error: ${errData}`);
    }

    const scansData = await supabaseRes.json();

    // 5. Rudisha data za history kwenda kwenye App yako ya simu
    return res.status(200).json(scansData);

  } catch (error) {
    console.error("SERVER ERROR:", error);
    return res.status(500).json({ error: "Kuna kitu kimefeli upande wa server", details: error.message });
  }
}
