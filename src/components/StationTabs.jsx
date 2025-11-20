function StationTabs({ viewMode, onChange }) {
  const isHome = viewMode === "home";

  return (
    <div className="toggle-tabs">
      <div
        className={`toggle-tabs-inner ${
          isHome ? "toggle-tabs-inner--home" : "toggle-tabs-inner--all"
        }`}
      >
        <span className="toggle-thumb" aria-hidden="true" />

        <button
          type="button"
          className={`toggle-btn ${isHome ? "toggle-btn--active" : ""}`}
          onClick={() => onChange("home")}
        >
          Your home station: Lindbergh Center
        </button>

        <button
          type="button"
          className={`toggle-btn ${!isHome ? "toggle-btn--active" : ""}`}
          onClick={() => onChange("all")}
        >
          All trains
        </button>
      </div>
    </div>
  );
}

export default StationTabs;
