import { useEffect, useState } from "react";
import "./App.css";
import StationTabs from "./components/StationTabs";
import TrainList from "./components/TrainList";
import StationPicker from "./components/StationPicker";   // ⬅️ NEW

const API_URL = "/api/trains";

const HOME_STATION_KEYWORDS = ["LINDBERGH", "LINDBERGH CENTER"];

function getWaitValue(t) {
  const wtRaw = t.WAITING_TIME || "";
  const wt = wtRaw.toLowerCase();

  if (wt.startsWith("arriv")) return 0;
  if (wt.startsWith("board")) return 10;

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

  return Number.MAX_SAFE_INTEGER;
}

function App() {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("home"); // "home" | "all"
  const [selectedStation, setSelectedStation] = useState(""); // ⬅️ NEW

  const fetchTrains = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("HTTP error " + res.status);

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
    fetchTrains();
    const id = setInterval(fetchTrains, 10000);
    return () => clearInterval(id);
  }, []);

  // unique station list for "All" picker
  const stationList = Array.from(
    new Set(trains.map((t) => t.STATION).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));

  // home station trains (Lindbergh)
  const homeStationTrains = trains.filter((t) => {
    if (!t.STATION) return false;
    const stationUpper = t.STATION.toUpperCase();
    return HOME_STATION_KEYWORDS.some((k) => stationUpper.includes(k));
  });

  // Decide what to show based on tab + selection
  let trainsToShow = [];
if (viewMode === "home") {
  trainsToShow = homeStationTrains;
} else if (viewMode === "all" && selectedStation) {
  trainsToShow = trains.filter((t) => t.STATION === selectedStation);
}

  const sortedTrainsToShow = [...trainsToShow].sort(
    (a, b) => getWaitValue(a) - getWaitValue(b)
  );

  return (
    <div className="App">
      <header className="App-header">
        <h1>MARTA Rail Realtime</h1>
        <p>Testing the official MARTA rail realtime API through a backend proxy.</p>

        {/* top-right loading chip when refreshing */}
        {loading && trains.length > 0 && (
          <div className="refresh-indicator">
            <div className="refresh-spinner" />
            <div className="refresh-bar">
              <div className="refresh-bar-fill" />
            </div>
          </div>
        )}

                <StationTabs viewMode={viewMode} onChange={setViewMode} />

        {/* HOME TAB – always show Lindbergh trains */}
        {viewMode === "home" && (
          <TrainList
            trains={sortedTrainsToShow}
            loading={loading}
            error={error}
            viewMode="home"
          />
        )}

        {/* ALL TAB – STEP 1: show station list only */}
        {viewMode === "all" && !selectedStation && (
          <StationPicker
            stations={stationList}
            selectedStation={selectedStation}
            onSelect={setSelectedStation}
          />
        )}

        {/* ALL TAB – STEP 2: after click, hide list and show trains + back */}
        {viewMode === "all" && selectedStation && (
          <>
            <div className="all-station-header">
              <button
                type="button"
                className="back-chip"
                onClick={() => setSelectedStation("")}
              >
                ← All stations
              </button>

              <div className="all-station-name">
                {selectedStation}
              </div>
            </div>

            <TrainList
              trains={sortedTrainsToShow}
              loading={loading}
              error={error}
              viewMode="all"
            />
          </>
        )}

      </header>
    </div>
  );
}

export default App;
