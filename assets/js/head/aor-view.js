// Applies the stored List/Grid preference before first paint so the index
// never flashes the wrong view. Mirrors Hextra's own no-FOUC theme script.
(function () {
  try {
    var view = localStorage.getItem("aor-index-view");
    if (view === "grid" || view === "list") {
      document.documentElement.setAttribute("data-aor-index-view", view);
    }
  } catch (e) {
    /* private mode / storage disabled: fall back to the default list view */
  }
})();
