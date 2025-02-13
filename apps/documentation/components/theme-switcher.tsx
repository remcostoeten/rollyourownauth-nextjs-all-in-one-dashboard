"use client";

import { useEffect, useState } from "react";

const themes = [
  { name: "neutral", label: "Neutral", isDark: false },
  { name: "neutral-dark", label: "Neutral Dark", isDark: true },
  { name: "black", label: "Black", isDark: true },
  { name: "vitepress", label: "Vitepress", isDark: false },
  { name: "vitepress-dark", label: "Vitepress Dark", isDark: true },
  { name: "dusk", label: "Dusk", isDark: true },
  { name: "catppuccin", label: "Catppuccin", isDark: false },
  { name: "catppuccin-dark", label: "Catppuccin Dark", isDark: true },
  { name: "ocean", label: "Ocean", isDark: false },
  { name: "ocean-dark", label: "Ocean Dark", isDark: true },
  { name: "purple", label: "Purple", isDark: false },
  { name: "purple-dark", label: "Purple Dark", isDark: true },
] as const;

const THEME_KEY = "docs-theme-preference";

export default function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState(0);

  useEffect(() => {
    // Load saved theme
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
      const themeIndex = themes.findIndex((t) => t.name === savedTheme);
      if (themeIndex !== -1) {
        setCurrentTheme(themeIndex);
      }
    }
  }, []);

  useEffect(() => {
    // Remove previous theme
    themes.forEach((theme) => {
      document.documentElement.classList.remove(`theme-${theme.name}`);
    });
    // Add current theme
    const newTheme = themes[currentTheme];
    if (newTheme) {
      document.documentElement.classList.add(`theme-${newTheme.name}`);
      // Set dark mode
      document.documentElement.dataset.theme = newTheme.isDark ? "dark" : "light";
      // Save theme preference
      localStorage.setItem(THEME_KEY, newTheme.name);
    }
  }, [currentTheme]);

  const cycleTheme = () => {
    setCurrentTheme((prev) => (prev + 1) % themes.length);
  };

  const theme = themes[currentTheme];
  if (!theme) return null;

  return (
    <button
      onClick={cycleTheme}
      className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-fd-muted/10 transition-colors"
      title={`Current theme: ${theme.label}. Click to change.`}
    >
      <span>Theme: {theme.label}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="ml-2"
      >
        <path d="M12 3v5" />
        <path d="M12 16v5" />
        <path d="M12 8a4 4 0 0 0 0 8" />
        <path d="M20 16.2A7 7 0 0 0 12 4" />
      </svg>
    </button>
  );
}
