import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import ClientProviders from "./components/ClientProviders";
import ContactButton from "./components/ContactButton";
import BottomNav from "./components/BottomNav";
import ThemeBackground from "./components/ThemeBackground";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://velounity.com"),
  title: {
    default: "velounity | บริการเติมเกมออนไลน์ เเละจำหน่ายเเอพพรีเมี่ยมราคาถูก",
    template: "%s | velounity",
  },
  description: "เติมเกมออนไลน์ รวดเร็ว ปลอดภัย ราคาถูก รองรับทุกเกมดัง เติมง่ายผ่านระบบอัตโนมัติ",
  keywords: ["เติมเกม", "topup", "เติมเงินเกม", "ซื้อไอเทม", "เติมเกมออนไลน์", "velounity"],
  authors: [{ name: "velounity" }],
  creator: "velounity",
  publisher: "velounity",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  
  // Open Graph (Facebook, LinkedIn, etc.)
  openGraph: {
    title: "velounity | บริการเติมเกมออนไลน์",
    description: "เติมเกมออนไลน์ รวดเร็ว ปลอดภัย ราคาถูก รองรับทุกเกมดัง",
    url: "https://velounity.com",
    siteName: "velounity",
    images: [
      {
        url: "https://velounity.com/banner.jpg",
        width: 1200,
        height: 630,
        alt: "velounity - บริการเติมเกมออนไลน์",
      },
    ],
    locale: "th_TH",
    type: "website",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "velounity | บริการเติมเกมออนไลน์",
    description: "เติมเกมออนไลน์ รวดเร็ว ปลอดภัย ราคาถูก รองรับทุกเกมดัง",
    images: ["https://velounity.com/banner.jpg"],
    creator: "@velounity",
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

async function getLogoUrl() {
  try {
    const settings = await prisma.websiteSettings.findFirst({
      select: { logoUrl: true },
    });
    return settings?.logoUrl || null;
  } catch (error) {
    console.error("Error fetching logo:", error);
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [session, logoUrl] = await Promise.all([
    auth.api.getSession({
      headers: await headers(),
    }),
    getLogoUrl(),
  ]);

  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-slate-950 dark:text-gray-100`}
      >
        <ClientProviders>
          <ThemeBackground />
          <div className="relative min-h-screen">
            <div className="relative pb-20 md:pb-0">
              <Navigation session={session} logoUrl={logoUrl} />
              {children}
            </div>
            <ContactButton />
            <BottomNav />
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
