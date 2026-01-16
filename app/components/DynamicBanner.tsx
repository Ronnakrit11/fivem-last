"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function DynamicBanner() {
  const [bannerUrl, setBannerUrl] = useState<string>("/banner.webp");

  useEffect(() => {
    fetch("/api/website-assets")
      .then(res => res.json())
      .then((data) => {
        if (data.bannerUrl) {
          setBannerUrl(data.bannerUrl);
        }
      })
      .catch((error) => console.error("Error fetching banner:", error));
  }, []);

  return (
    <section className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative w-full rounded-3xl overflow-hidden glass-panel hover:shadow-[0_0_50px_-12px_rgba(124,58,237,0.25)] transition-shadow duration-500">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent z-10 pointer-events-none" />
          <Image
            src={bannerUrl}
            alt="Banner"
            width={1920}
            height={560}
            className="w-full h-auto transform hover:scale-[1.02] transition-transform duration-700 ease-out"
            priority
            quality={85}
            unoptimized
          />
        </div>
      </div>
    </section>
  );
}
