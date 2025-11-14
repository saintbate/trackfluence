/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { GA_ENABLED, track } from "@/lib/ga";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  function toggle() {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("light");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "light" : "dark");
    }
    if (GA_ENABLED) {
      try {
        const next =
          theme === "light" ? "dark" : theme === "dark" ? "light" : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
        void track("theme_toggled", { theme: next as "light" | "dark" | "system" });
      } catch {}
    }
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const isEditable =
        !!target &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
      if (isEditable) return;

      const isMac = typeof navigator !== "undefined" && /Mac/i.test(navigator.platform);
      const mod = isMac ? e.metaKey : e.ctrlKey;
      if (mod && e.key.toLowerCase() === "j") {
        e.preventDefault();
        toggle();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [theme]);

  if (!mounted) {
    // Avoid hydration mismatch
    return (
      <button
        aria-label="Toggle theme"
        className="rounded-md border px-2 py-1 opacity-70"
        disabled
      >
        …
      </button>
    );
  }

  const isDark = (theme ?? resolvedTheme) === "dark";

  return (
    <button
      aria-label="Toggle theme"
      className="rounded-md border px-2 py-1 hover:opacity-80"
      onClick={toggle}
    >
      {isDark ? "🌙" : "☀️"}
    </button>
  );
}