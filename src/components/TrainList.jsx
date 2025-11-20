// src/components/TrainList.jsx

// map train to a line color (Doraville → Gold, North Springs → Red, etc.)
function getLineColor(t) {
  const dest = (t.DESTINATION || "").toLowerCase();
  const line = (t.LINE || "").toUpperCase();

  // Destination-based rules where we are 100% sure
  if (dest.includes("doraville")) return "gold"; // Doraville branch
  if (dest.includes("north springs")) return "red"; // North Springs branch

  // For Airport and everything else, trust the MARTA LINE field
  switch (line) {
    case "RED":
      return "red";
    case "GOLD":
      return "gold";
    case "BLUE":
      return "blue";
    case "GREEN":
      return "green";
    default:
      return "default";
  }
}

function TrainList({ trains, loading, error, viewMode }) {
  if (error) {
    return (
      <p className="status status-error">
        Error: {error}. Open DevTools console for more details.
      </p>
    );
  }

  // Only show the big loader when we have no trains at all yet
  if (loading && trains.length === 0) {
    return (
      <p className="status status-loading">Loading train data...</p>
    );
  }

  if (!loading && !error && trains.length === 0) {
    return (
      <p className="status">
        {viewMode === "home"
          ? "No trains currently listed for Lindbergh Center."
          : "No trains returned yet."}
      </p>
    );
  }

  const showStationName = viewMode !== "home";

  return (
    <div className="train-list">
      {trains.map((t, index) => {
        const lineColor = getLineColor(t);

        return (
          <div key={index} className="train-row">
            <div className="train-main">
              {/* Left: station (for All tab) + destination */}
              <div className="train-text">
                {showStationName && (
                  <div className="train-station">{t.STATION}</div>
                )}

                <div className="train-destination-row">
                  <span className="train-destination">{t.DESTINATION}</span>

                  {/* Colored pill for line */}
                  <span className={`line-pill line-pill--${lineColor}`}>
                    {t.LINE || "Line"}
                  </span>
                </div>

                <div className="train-meta">
                  <span>Direction: {t.DIRECTION}</span>
                  <span>Next: {t.NEXT_ARR}</span>
                </div>
              </div>

              {/* Right: waiting time big and bold */}
              <div className="train-wait">
                <span className="train-wait-value">{t.WAITING_TIME}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TrainList;
