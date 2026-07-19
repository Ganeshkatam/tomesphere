"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type Theme = "system" | "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark");

  // Helper to resolve and apply classes to the HTML element
  const applyTheme = (targetTheme: Theme) => {
    const root = document.documentElement;
    let isDark = false;

    if (targetTheme === "system") {
      isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    } else {
      isDark = targetTheme === "dark";
    }

    const resolved = isDark ? "dark" : "light";
    setResolvedTheme(resolved);

    // Temporarily disable transitions to prevent transition flash
    root.classList.add("theme-changing");

    // Reset and set class in one atomic operation
    root.classList.remove("light", "dark");
    root.classList.add(resolved);

    // Re-enable transitions in the next paint cycle
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.classList.remove("theme-changing");
      });
    });
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem("theme", newTheme);
    } catch (e) {
      // Silently fail if localStorage is disabled/restricted
    }
    applyTheme(newTheme);
  };

  // Load initial theme from localStorage on mount
  useEffect(() => {
    let savedTheme: Theme = "system";
    try {
      savedTheme = (localStorage.getItem("theme") as Theme | null) || "system";
    } catch (e) {
      savedTheme = "system";
    }
    setThemeState(savedTheme);
    applyTheme(savedTheme);
  }, []);

  // Listen to OS prefers-color-scheme changes dynamically
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const listener = () => {
      let currentTheme: Theme = "system";
      try {
        currentTheme =
          (localStorage.getItem("theme") as Theme | null) || "system";
      } catch (e) {
        currentTheme = "system";
      }
      if (currentTheme === "system") {
        applyTheme("system");
      }
    };

    // Modern EventListener API
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  // Sync theme preferences across browser tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "theme") {
        const newTheme = (e.newValue as Theme | null) || "system";
        setThemeState(newTheme);
        applyTheme(newTheme);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
