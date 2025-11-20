import { useEffect, useState } from "react";
import "./App.css";
import StationTabs from "./components/StationTabs";
import TrainList from "./components/TrainList";

const API_URL = "/api/trains";

// keywords we'll treat as "home" station
const HOME_STATION_KEYWORDS = ["LINDBERGH", "LINDBERGH CENTER"];

// Convert WAITING_TIME / WAITING_SECONDS to a sortable number
function getWaitValue(t) {
  const wtRaw = t.WAITING_TIME || "";
  const wt = wtRaw.toLowerCase();

  if (wt.startsWith("arriv")) return 0; // Arriving
  if (wt.startsWith("board")) return 10; // Boarding

  const secStr = t.WAITING_SECONDS;
  if (secStr) {
    const sec = parseInt(secStr, 10);
    if (!Number.isNaN(sec)) return sec;
  }

  const match = wt.match(/(\d+)/);
  if (match) {
    const minutes = parseInt(match[1], 10);
    if (!Number.isNaN(minutes)) return minutes * 60;
  }

  return Number.MAX_SAFE_INTEGER; // unknown → bottom
}

function App() {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("home"); // "all" or "home"

  const fetchTrains = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(API_URL);
      if (!res.ok) {
        throw new Error("HTTP error " + res.status);
      }

      const data = await res.json();
      console.log("MARTA rail data from proxy:", data);

      if (Array.isArray(data)) {
        setTrains(data);
      } else {
        setError("API did not return a list");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // first load
    fetchTrains();

    // auto refresh every 10 seconds
    const id = setInterval(() => {
      fetchTrains();
    }, 10000);

    return () => clearInterval(id);
  }, []);

  // Filter for your home station (Lindbergh Center)
  const homeStationTrains = trains.filter((t) => {
    if (!t.STATION) return false;
    const stationUpper = t.STATION.toUpperCase();
    return HOME_STATION_KEYWORDS.some((k) => stationUpper.includes(k));
  });

  // Decide what to show based on the current tab
  const trainsToShow = viewMode === "home" ? homeStationTrains : trains;

  // Sort like MARTA boards: Arriving, 1 min, 2 min, ...
  const sortedTrainsToShow = [...trainsToShow].sort(
    (a, b) => getWaitValue(a) - getWaitValue(b)
  );

  return (
    <div className="App">
      <header className="App-header">
        <h1>MARTA Rail Realtime</h1>
        <p>Testing the official MARTA rail realtime API through a backend proxy.</p>

        {/* tiny status only if we already have data */}
        {loading && trains.length > 0 && (
          <p className="status status-loading">Refreshing trains…</p>
        )}

        <StationTabs viewMode={viewMode} onChange={setViewMode} />

        <TrainList
          trains={sortedTrainsToShow}
          loading={loading}
          error={error}
          viewMode={viewMode}
        />
      </header>
    </div>
  );
}

export default App;
