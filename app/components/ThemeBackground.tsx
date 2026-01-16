"use client";

import { useTheme } from "@/app/contexts/ThemeContext";
import { useEffect } from "react";

export default function ThemeBackground() {
  const { colors } = useTheme();
;

  // ตรวจสอบว่าเป็นสีอ่างหรือสีเข้ม
  const isLightBackground = (color: string) => {
    // ถ้าเป็น hex
    if (color.startsWith('#')) {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 128;
    }
    
    // ถ้าเป็น rgb/rgba
    if (color.startsWith('rgb')) {
      const match = color.match(/\d+/g);
      if (match && match.length >= 3) {
        const r = parseInt(match[0]);
        const g = parseInt(match[1]);
        const b = parseInt(match[2]);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128;
      }
    }
    
    return false;
  };

  const showGradients = !isLightBackground(colors.backgroundColor);

  return (
    <div 
      className="fixed inset-0 -z-10 transition-colors duration-500"
      style={{ backgroundColor: colors.backgroundColor }}
    >
      {showGradients && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Subtle dark brown-gold gradient */}
          <div className="absolute inset-0 [background:radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,80,40,0.15),transparent_60%)]"></div>
          <div className="absolute inset-0 [background:radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(80,50,20,0.1),transparent_50%)]"></div>
        </div>
      )}
    </div>
  );
}
