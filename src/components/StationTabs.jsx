// src/components/StationTabs.jsx
function StationTabs({ viewMode, onChange }) {
  return (
    <div className="tabs">
      {/* First tab: Home station */}
      <button
        className={`tab ${viewMode === "home" ? "tab--active" : ""}`}
        onClick={() => onChange("home")}
      >
        Your home station: Lindbergh Center
      </button>

      {/* Second tab: All trains */}
      <button
        className={`tab ${viewMode === "all" ? "tab--active" : ""}`}
        onClick={() => onChange("all")}
      >
        All trains
      </button>
    </div>
  );
}

export default StationTabs;
