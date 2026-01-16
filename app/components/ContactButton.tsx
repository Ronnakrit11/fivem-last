"use client";

import { MessageCircle } from "lucide-react";

export default function ContactButton() {
  return (
    <a
      href="https://lin.ee/S8gD0y6"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="ติดต่อเรา"
    >
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-purple-500/30 blur-xl rounded-full group-hover:bg-purple-400/40 transition-all duration-300"></div>
        
        {/* Button */}
        <div className="relative bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white p-4 rounded-full shadow-lg shadow-purple-500/50 transition-all duration-300 group-hover:scale-110 group-hover:shadow-purple-400/60">
          <MessageCircle className="w-6 h-6" />
        </div>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900/95 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          ติดต่อเรา
        </div>
      </div>
    </a>
  );
}
