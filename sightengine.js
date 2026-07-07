import axios from "axios";
import FormData from "form-data";

export async function checkImage(imageBuffer, fileName = "image.jpg") {
  const data = new FormData();

  data.append("media", imageBuffer, fileName);
  data.append("models", "nudity-2.1,gore-2.0");
  data.append("api_user", process.env.SIGHTENGINE_USER);
  data.append("api_secret", process.env.SIGHTENGINE_SECRET);

  const response = await axios.post(
    "https://api.sightengine.com/1.0/check.json",
    data,
    {
      headers: data.getHeaders(),
    }
  );

  return response.data;
}


// Kwa /api/image (imageUrl)
export default async function analyzeImage(imageUrl) {

  const response = await axios.get(
    "https://api.sightengine.com/1.0/check.json",
    {
      params: {
        url: imageUrl,
        models: "nudity-2.1,gore-2.0",
        api_user: process.env.SIGHTENGINE_USER,
        api_secret: process.env.SIGHTENGINE_SECRET,
      },
    }
  );

  return response.data;
}
