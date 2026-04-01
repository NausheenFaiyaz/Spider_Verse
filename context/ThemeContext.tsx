import React, { createContext, useContext, useMemo, useState } from "react";

export type AppTheme = "dark" | "neon";

type ThemePalette = {
  background: string;
  surface: string;
  text: string;
  subtext: string;
  accent: string;
  shadow: string;
  buttonText: string;
  spider: string;
  overlay: string;
  panel: string;
  border: string;
};

type ThemeContextValue = {
  theme: AppTheme;
  colors: ThemePalette;
  toggleTheme: () => void;
};

const palettes: Record<AppTheme, ThemePalette> = {
  dark: {
    background: "#050505",
    surface: "#050505",
    text: "#f8f7f3",
    subtext: "#ffda2d",
    accent: "#ffd22e",
    shadow: "#2f49ff",
    buttonText: "#151101",
    spider: "#f8f7f3",
    overlay: "rgba(4, 4, 4, 0.46)",
    panel: "rgba(10, 10, 10, 0.84)",
    border: "#1b1500",
  },
  neon: {
    background: "#ffffff",
    surface: "#ffffff",
    text: "#111111",
    subtext: "#111111",
    accent: "#ffe45a",
    shadow: "#b8b8b8",
    buttonText: "#191300",
    spider: "#111111",
    overlay: "rgba(255, 255, 255, 0.62)",
    panel: "rgba(255, 255, 255, 0.78)",
    border: "#1b1500",
  },
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<AppTheme>("dark");

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      colors: palettes[theme],
      toggleTheme: () =>
        setTheme((current) => (current === "dark" ? "neon" : "dark")),
    }),
    [theme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
