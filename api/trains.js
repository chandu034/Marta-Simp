// api/trains.js (Vercel serverless function)
import fetch from "node-fetch";

export default async function handler(req, res) {
  const API_KEY = process.env.MARTA_API_KEY; // we'll configure this in Vercel

  if (!API_KEY) {
    return res.status(500).json({ error: "Missing MARTA_API_KEY env var" });
  }

  const MARTA_URL =
    `https://developerservices.itsmarta.com:18096/itsmarta/railrealtimearrivals/developerservices/traindata?apiKey=${API_KEY}`;

  try {
    const response = await fetch(MARTA_URL);

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "MARTA API error", status: response.status });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error("Serverless /api/trains error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
