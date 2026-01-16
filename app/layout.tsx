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

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://infinitygamecenter.com"),
  title: {
    default: "infinitygamecenter | บริการเติมเกมออนไลน์ เเละจำหน่ายเเอพพรีเมี่ยมราคาถูก",
    template: "%s | infinitygamecenter",
  },
  description: "เติมเกมออนไลน์ รวดเร็ว ปลอดภัย ราคาถูก รองรับทุกเกมดัง เติมง่ายผ่านระบบอัตโนมัติ",
  keywords: ["เติมเกม", "topup", "เติมเงินเกม", "ซื้อไอเทม", "เติมเกมออนไลน์", "infinitygamecenter"],
  authors: [{ name: "infinitygamecenter" }],
  creator: "infinitygamecenter",
  publisher: "infinitygamecenter",
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
    title: "infinitygamecenter | บริการเติมเกมออนไลน์",
    description: "เติมเกมออนไลน์ รวดเร็ว ปลอดภัย ราคาถูก รองรับทุกเกมดัง",
    url: "https://infinitygamecenter.com",
    siteName: "infinitygamecenter",
    images: [
      {
        url: "https://infinitygamecenter.com/banner.jpg",
        width: 1200,
        height: 630,
        alt: "infinitygamecenter - บริการเติมเกมออนไลน์",
      },
    ],
    locale: "th_TH",
    type: "website",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "infinitygamecenter | บริการเติมเกมออนไลน์",
    description: "เติมเกมออนไลน์ รวดเร็ว ปลอดภัย ราคาถูก รองรับทุกเกมดัง",
    images: ["https://infinitygamecenter.com/banner.jpg"],
    creator: "@infinitygamecenter",
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-slate-950 dark:text-gray-100`}
      >
        <ClientProviders>
          <ThemeBackground />
          <div className="relative min-h-screen">
            <div className="relative pb-20 md:pb-0">
              <Navigation session={session} />
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
