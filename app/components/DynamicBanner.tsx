import Image from "next/image";
import { prisma } from "@/lib/prisma";

async function getBannerUrl() {
  try {
    const settings = await prisma.websiteSettings.findFirst({
      select: { bannerUrl: true },
    });
    return settings?.bannerUrl || null;
  } catch (error) {
    console.error("Error fetching banner:", error);
    return null;
  }
}

export default async function DynamicBanner() {
  const bannerUrl = await getBannerUrl();

  if (!bannerUrl) {
    return (
      <section className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="relative w-full rounded-3xl overflow-hidden glass-panel aspect-[1920/560] bg-slate-800/50" />
        </div>
      </section>
    );
  }

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
