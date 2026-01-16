"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type ThemeColors = {
  navbarColor: string;
  backgroundColor: string;
  bottomNavColor: string;
  homeButtonBgColor: string;
  homeButtonTextColor: string;
  homeButtonActiveBg: string;
  homeButtonActiveText: string;
  bottomNavIconColor: string;
  bottomNavTextColor: string;
  bottomNavActiveIcon: string;
  bottomNavActiveText: string;
};

type ThemeContextType = {
  colors: ThemeColors;
  updateColors: (newColors: Partial<ThemeColors>) => void;
  resetColors: () => void;
  refreshColors: () => Promise<void>;
};

const defaultColors: ThemeColors = {
  navbarColor: "rgba(15, 23, 42, 0.7)",
  backgroundColor: "#0a0e1a",
  bottomNavColor: "rgba(15, 23, 42, 0.7)",
  homeButtonBgColor: "rgba(255, 255, 255, 0.1)",
  homeButtonTextColor: "#d1d5db",
  homeButtonActiveBg: "rgba(255, 255, 255, 0.1)",
  homeButtonActiveText: "#a78bfa",
  bottomNavIconColor: "#d1d5db",
  bottomNavTextColor: "#d1d5db",
  bottomNavActiveIcon: "#fbbf24",
  bottomNavActiveText: "#fbbf24",
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [colors, setColors] = useState<ThemeColors>(defaultColors);

  // ดึงสีจาก API เมื่อโหลดครั้งแรก
  useEffect(() => {
    refreshColors();
  }, []);

  const refreshColors = async () => {
    try {
      const response = await fetch("/api/admin/website-settings");
      if (response.ok) {
        const data = await response.json();
        setColors({
          navbarColor: data.navbarColor,
          backgroundColor: data.backgroundColor,
          bottomNavColor: data.bottomNavColor,
          homeButtonBgColor: data.homeButtonBgColor,
          homeButtonTextColor: data.homeButtonTextColor,
          homeButtonActiveBg: data.homeButtonActiveBg,
          homeButtonActiveText: data.homeButtonActiveText,
          bottomNavIconColor: data.bottomNavIconColor,
          bottomNavTextColor: data.bottomNavTextColor,
          bottomNavActiveIcon: data.bottomNavActiveIcon,
          bottomNavActiveText: data.bottomNavActiveText,
        });
      }
    } catch (error) {
      console.error("Error fetching theme colors:", error);
    }
  };

  const updateColors = (newColors: Partial<ThemeColors>) => {
    setColors((prev) => ({ ...prev, ...newColors }));
  };

  const resetColors = () => {
    setColors(defaultColors);
  };

  return (
    <ThemeContext.Provider value={{ colors, updateColors, resetColors, refreshColors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
