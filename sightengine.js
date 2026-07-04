export default async function analyzeImage(imageUrl) {
  const user = process.env.SIGHTENGINE_USER;
  const secret = process.env.SIGHTENGINE_SECRET;

  if (!user || !secret) {
    throw new Error("Missing Sightengine credentials");
  }

  const url = new URL("https://api.sightengine.com/1.0/check.json");

  url.searchParams.append("url", imageUrl);
  url.searchParams.append("models", "nudity,wad,offensive,scam,faces");

  url.searchParams.append("api_user", user);
  url.searchParams.append("api_secret", secret);

  const response = await fetch(url.toString(), {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Sightengine API request failed");
  }

  const data = await response.json();

  return data;
    }
