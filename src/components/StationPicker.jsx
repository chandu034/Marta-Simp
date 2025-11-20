// src/components/StationPicker.jsx
import { useMemo, useState } from "react";

function StationPicker({ stations, selectedStation, onSelect }) {
  const [query, setQuery] = useState("");

  const filteredStations = useMemo(
    () =>
      stations.filter((name) =>
        name.toLowerCase().includes(query.toLowerCase())
      ),
    [stations, query]
  );

  return (
    <div className="station-panel">
      <div className="station-panel-header">
        <div className="station-panel-title">
          <span className="station-panel-label">All stations</span>
          <span className="station-panel-count">
            {filteredStations.length} shown
          </span>
        </div>

        <input
          className="station-panel-search"
          placeholder="Search station…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="station-list">
        {filteredStations.map((name) => {
          const isActive = name === selectedStation;
          const initials = name
            .split(" ")
            .filter(Boolean)
            .map((w) => w[0])
            .join("")
            .slice(0, 3)
            .toUpperCase();

          return (
            <button
              key={name}
              type="button"
              className={`station-row ${isActive ? "station-row--active" : ""}`}
              onClick={() => onSelect(name)}
            >
              <div className="station-row-avatar">
                <span>{initials}</span>
              </div>

              <div className="station-row-text">
                <div className="station-row-name">{name}</div>
                <div className="station-row-sub">
                  Tap to view arrivals for this station
                </div>
              </div>

              <div className="station-row-chevron">›</div>
            </button>
          );
        })}

        {filteredStations.length === 0 && (
          <div className="station-empty">No stations match that search.</div>
        )}
      </div>
    </div>
  );
}

export default StationPicker;
