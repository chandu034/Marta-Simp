// codespaces-react/api/trains.js

// node-fetch with dynamic import so it works even when "type": "module" exists
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetchFn }) => fetchFn(...args));

module.exports = async (req, res) => {
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

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(data);
  } catch (err) {
    console.error("Serverless /api/trains error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};
