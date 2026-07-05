import { db } from "./db.js";

export async function trackUsage(apiKey) {
  const { data } = await db
    .from("api_usage")
    .select("*")
    .eq("api_key", apiKey)
    .single();

  if (!data) {
    await db.from("api_usage").insert([
      {
        api_key: apiKey,
        requests: 1,
      },
    ]);
  } else {
    await db
      .from("api_usage")
      .update({
        requests: data.requests + 1,
        updated_at: new Date(),
      })
      .eq("api_key", apiKey);
  }
}
