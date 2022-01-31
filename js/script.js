function getPreferredTheme() {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    document.getElementById("darkThemeCheckbox").checked = true;
  }
  setColorTheme();
}

function setColorTheme() {
  if (document.getElementById("darkThemeCheckbox").checked) {
    addDarkTheme();
  } else {
    removeDarkTheme();
  }
}

function addDarkTheme() {
  document.body.classList.add("dark-theme");
}

function removeDarkTheme() {
  document.body.classList.remove("dark-theme");
}
