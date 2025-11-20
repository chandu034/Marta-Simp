// api/trains.js

// Vercel Node runtime (Node 18+ / 22+) already has global fetch.
// We do NOT need node-fetch here.

export default async function handler(req, res) {
  const API_KEY = process.env.MARTA_API_KEY;

  if (!API_KEY) {
    console.error("Missing MARTA_API_KEY env var");
    res.status(500).json({ error: "Missing MARTA_API_KEY env var" });
    return;
  }

  const MARTA_URL =
    `https://developerservices.itsmarta.com:18096/itsmarta/railrealtimearrivals/developerservices/traindata?apiKey=${API_KEY}`;

  try {
    const response = await fetch(MARTA_URL);

    if (!response.ok) {
      console.error("MARTA API error", response.status);
      res
        .status(response.status)
        .json({ error: "MARTA API error", status: response.status });
      return;
    }

    const data = await response.json();

    // CORS for your frontend
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(data);
  } catch (err) {
    console.error("Serverless /api/trains error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
}
