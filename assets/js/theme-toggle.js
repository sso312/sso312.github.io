(function () {
  "use strict";

  var root = document.documentElement;
  var button = document.getElementById("theme-toggle");
  if (!button) return;

  var icon = button.querySelector(".theme-toggle__icon");

  function getTheme() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function updateButton(theme) {
    var dark = theme === "dark";
    icon.textContent = dark ? "☀️" : "🌙";
    button.setAttribute("aria-label", dark ? "라이트 모드로 전환" : "다크 모드로 전환");
    button.setAttribute("title", dark ? "라이트 모드로 전환" : "다크 모드로 전환");
    button.setAttribute("aria-pressed", dark ? "true" : "false");
  }

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    updateButton(theme);
    try {
      localStorage.setItem("theme", theme);
    } catch (error) {
      // The theme still works when browser storage is unavailable.
    }
  }

  updateButton(getTheme());

  button.addEventListener("click", function () {
    setTheme(getTheme() === "dark" ? "light" : "dark");
  });
})();
