export default async function analyzeImage(imageUrl) {
  const res = await fetch("https://api.sightengine.com/1.0/check.json", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      url: imageUrl,
      models: "nudity,offensive,wad,genai",
      api_user: process.env.SIGHTENGINE_USER,
      api_secret: process.env.SIGHTENGINE_SECRET,
    }),
  });

  const data = await res.json();

  console.log("SIGHTENGINE RAW RESPONSE:", data);

  if (!res.ok || data.status === "failure") {
    throw new Error(JSON.stringify(data));
  }

  return data;
}
