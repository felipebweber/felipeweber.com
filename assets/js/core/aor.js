// felipeweber.com — index view switch, featured box toggle and month scrollspy.
(function () {
  var VIEW_KEY = "aor-index-view";
  var FEATURED_KEY = "aor-featured-open";

  function store(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      /* storage unavailable, preference just won't persist */
    }
  }

  function read(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function currentView() {
    return document.documentElement.getAttribute("data-aor-index-view") === "grid" ? "grid" : "list";
  }

  function initViewToggle() {
    var index = document.querySelector(".aor-index");
    var toggle = document.querySelector(".aor-index-view-toggle");
    if (!index || !toggle) return;

    // Reveal the control only now that it is wired up.
    index.classList.add("aor-index-enhanced");

    var buttons = toggle.querySelectorAll("button[data-aor-view]");

    function apply(view) {
      if (view === "grid") {
        document.documentElement.setAttribute("data-aor-index-view", "grid");
      } else {
        document.documentElement.removeAttribute("data-aor-index-view");
      }
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].setAttribute("aria-pressed", buttons[i].dataset.aorView === view ? "true" : "false");
      }
    }

    apply(currentView());

    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", function (event) {
        var view = event.currentTarget.dataset.aorView;
        apply(view);
        store(VIEW_KEY, view);
      });
    }
  }

  function initFeatured() {
    var section = document.getElementById("aor-featured-posts");
    if (!section) return;

    var button = section.querySelector(".aor-featured__toggle");
    var body = document.getElementById("aor-featured-posts-body");
    if (!button || !body) return;

    var labelOpen = section.dataset.buttonOpen || "Hide";
    var labelClosed = section.dataset.buttonClosed || "Show";

    function apply(open) {
      body.hidden = !open;
      button.setAttribute("aria-expanded", open ? "true" : "false");
      button.textContent = open ? labelOpen : labelClosed;
    }

    apply(read(FEATURED_KEY) !== "false");

    button.addEventListener("click", function () {
      var open = button.getAttribute("aria-expanded") !== "true";
      apply(open);
      store(FEATURED_KEY, open ? "true" : "false");
    });
  }

  // The TOC links point at the list-view anchors; in grid view we redirect the
  // jump to the matching grid section, which carries a different DOM id.
  function initTocMonths() {
    var links = document.querySelectorAll(".aor-toc__link[data-aor-month]");
    if (!links.length) return;

    function targetFor(key) {
      var prefix = currentView() === "grid" ? "aor-grid-" : "aor-list-";
      return document.getElementById(prefix + key);
    }

    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener("click", function (event) {
        var key = event.currentTarget.dataset.aorMonth;
        var target = targetFor(key);
        if (!target) return;
        event.preventDefault();
        var section = target.closest(".aor-index-month") || target;
        section.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
          block: "start",
        });
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, "", "#" + target.id);
        }
      });
    }

    if (!("IntersectionObserver" in window)) return;

    var observer = new IntersectionObserver(
      function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (!entries[i].isIntersecting) continue;
          var id = entries[i].target.id.replace(/^aor-(list|grid)-/, "");
          for (var j = 0; j < links.length; j++) {
            if (links[j].dataset.aorMonth === id) {
              links[j].setAttribute("aria-current", "true");
            } else {
              links[j].removeAttribute("aria-current");
            }
          }
        }
      },
      { rootMargin: "-10% 0px -75% 0px", threshold: 0 }
    );

    var headings = document.querySelectorAll(".aor-index-month__header h2[id]");
    for (var k = 0; k < headings.length; k++) {
      observer.observe(headings[k]);
    }
  }

  function init() {
    initViewToggle();
    initFeatured();
    initTocMonths();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
