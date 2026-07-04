import { db } from "./db.js";

export async function validateKey(apiKey) {
  const { data, error } = await db
    .from("api_keys")
    .select("*")
    .eq("api_key", apiKey)
    .single();

  if (error || !data) {
    return false;
  }

  return true;
}
