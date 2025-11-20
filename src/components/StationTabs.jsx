// src/components/StationTabs.jsx
function StationTabs({ viewMode, onChange }) {
  const isHome = viewMode === "home";

  return (
    <div className="toggle-compact">
      <div
        className={`toggle-compact-inner ${
          isHome ? "toggle-home" : "toggle-all"
        }`}
      >
        <span className="toggle-thumb" />

        <button
          className={`toggle-small ${isHome ? "active" : ""}`}
          onClick={() => onChange("home")}
        >
          Home
        </button>

        <button
          className={`toggle-small ${!isHome ? "active" : ""}`}
          onClick={() => onChange("all")}
        >
          All
        </button>
      </div>
    </div>
  );
}

export default StationTabs;
