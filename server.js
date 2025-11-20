// server.js (ESM version)
import express from "express";
import cors from "cors";
import fetch from "node-fetch"; // Not built in for ES modules, so we import it

const app = express();
app.use(cors()); // allow React to access our server

// 🔑 Your MARTA key
const API_KEY = "ab041b7c-5914-48c6-8361-f53eff31edfe";

const MARTA_URL = `https://developerservices.itsmarta.com:18096/itsmarta/railrealtimearrivals/developerservices/traindata?apiKey=${API_KEY}`;

app.get("/api/trains", async (req, res) => {
  try {
    const response = await fetch(MARTA_URL);
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "MARTA API error", status: response.status });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`MARTA backend proxy running on http://localhost:${PORT}`);
});
