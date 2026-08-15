"use client";

const THEME_STORAGE_KEY = "oakit-theme";

export function ThemeSwitch() {
  function toggleTheme() {
    const root = document.documentElement;
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";

    root.dataset.theme = nextTheme;
    root.style.colorScheme = nextTheme;

    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // The selected theme still applies when browser storage is unavailable.
    }
  }

  return (
    <button
      className="theme-switch"
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      title="Toggle color theme"
    >
      <svg
        className="theme-icon theme-icon-sun"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <circle cx="10" cy="10" r="3.25" />
        <path d="M10 1.75v2M10 16.25v2M1.75 10h2M16.25 10h2M4.17 4.17l1.42 1.42M14.41 14.41l1.42 1.42M15.83 4.17l-1.42 1.42M5.59 14.41l-1.42 1.42" />
      </svg>
      <svg
        className="theme-icon theme-icon-moon"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path d="M16.45 12.5A7 7 0 0 1 7.5 3.55a7 7 0 1 0 8.95 8.95Z" />
      </svg>
    </button>
  );
}
