(function () {
  const stored = localStorage.getItem("theme");
  const theme =
    stored ||
    (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  document.documentElement.setAttribute("data-theme", theme);
})();
