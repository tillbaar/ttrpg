// Wrapping everything in this function keeps "open", "toggle", out of the
// global scope, so they cannot accidentally clash with variables from other
// script on the page. It runs immediately because of the () at the very end.
// This pattern is called an IIFE (Immediately Invoked Function Expression).

(function () {
  var STORAGE_KEY = "sidebar-open";

  var checkbox = document.getElementById("sidebar-toggle-checkbox");
  if (!checkbox) return;

  try {
    checkbox.checked = localStorage.getItem(STORAGE_KEY) === "1";
  } catch (e) {}

  checkbox.addEventListener("change", function () {
    try {
      localStorage.setItem(STORAGE_KEY, checkbox.checked ? "1" : "0");
    } catch (e) {}
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") checkbox.checked = false;
  });
})();