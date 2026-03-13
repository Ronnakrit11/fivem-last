import Link from "next/link";
import Image from "next/image";
import { Crown, Gamepad2, CreditCard, Gavel, Package } from "lucide-react";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import RecentOrders from "./components/RecentOrders";
import ArticlesSection from "./components/ArticlesSection";
import SellItemForm from "./components/SellItemForm";
import DynamicBanner from "./components/DynamicBanner";
import HomeGames from "./home-games";
import HomeCards from "./home-cards";
import HomeRealProducts from "./home-real-products";
import { prisma } from "@/lib/prisma";

// Dynamic import for HomeGameItems to reduce initial bundle size
const HomeGameItems = dynamic(() => import("./home-game-items"), {
  loading: () => <ProductsSkeleton />,
  ssr: true,
});

interface Game {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface Card {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface GameItem {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  isCustomPrice: boolean;
  stock: number;
  isUnlimitedStock: boolean;
  isAuction: boolean;
  auctionEndDate: string | null;
  isActive: boolean;
}

interface RealProduct {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  stock: number;
  isActive: boolean;
}

interface SectionConfig {
  title?: string;
  subtitle?: string;
  visible?: boolean;
  glowColor?: string;
  titleColor?: string;
  cardBgColor?: string;
  cardTextColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
}

interface CustomSectionData {
  id: string;
  title: string;
  subtitle: string;
  position: string;
  icon: string;
  glowColor: string;
  sort: number;
  visible: boolean;
  content: string;
}

interface TrustBarItem {
  title: string;
  desc: string;
  icon: string;
  visible: boolean;
}

interface FooterConfig {
  title: string;
  description: string;
  links: { label: string; href: string }[];
  visible: boolean;
}

// Loading skeleton for products
function ProductsSkeleton() {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl overflow-hidden animate-pulse glass-panel"
          >
            <div className="w-full h-32 md:h-40 bg-slate-700/50" />
            <div className="p-3 md:p-4 space-y-3">
              <div className="h-4 bg-slate-700/50 rounded w-3/4" />
              <div className="h-4 bg-slate-700/50 rounded w-1/2" />
              <div className="h-8 bg-slate-700/50 rounded mt-4" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <div className="inline-block h-12 w-48 bg-slate-700/50 rounded-lg animate-pulse" />
      </div>
    </>
  );
}

// Fetch game items from API
async function getGameItems(): Promise<GameItem[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const response = await fetch(`${baseUrl}/api/game-items`, {
      cache: "no-store", // Always fetch fresh data
    });

    if (response.ok) {
      const data = await response.json();
      return data.data || [];
    }
  } catch (error) {
    console.error("Error fetching game items:", error);
  }
  return [];
}

async function getFeaturedGames(): Promise<Game[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/games/featured`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      return data.games || [];
    }
  } catch (error) {
    console.error("Error fetching featured games:", error);
  }
  return [];
}

async function getCards(): Promise<Card[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/cards`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      return data.cards || [];
    }
  } catch (error) {
    console.error("Error fetching cards:", error);
  }
  return [];
}

async function getRealProducts(): Promise<RealProduct[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/real-products`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      return data.data || [];
    }
  } catch (error) {
    console.error("Error fetching real products:", error);
  }
  return [];
}

async function getHomePageContent() {
  try {
    const content = await prisma.homePageContent.findFirst();
    return content;
  } catch {
    return null;
  }
}

// Enable ISR (Incremental Static Regeneration)
export const revalidate = 60;

export default async function Home() {
  // Fetch all data in parallel
  const [gameItems, games, cards, realProducts, homeContent] = await Promise.all([
    getGameItems(),
    getFeaturedGames(),
    getCards(),
    getRealProducts(),
    getHomePageContent(),
  ]);

  // Parse homepage content from DB (with fallbacks)
  const sections: Record<string, SectionConfig> = (homeContent?.sections as any) || {};
  const trustBarItems: TrustBarItem[] = (homeContent?.trustBar as any) || [
    { title: "การันตีความพอใจ", desc: "เปลี่ยน/คืนเงินตามเงื่อนไข", icon: "shield", visible: true },
    { title: "การชำระเงินปลอดภัย", desc: "ปกป้องข้อมูลผู้ใช้เข้มงวด", icon: "lock", visible: true },
    { title: "ฝ่ายสนับสนุนฉับไว", desc: "ตอบกลับเร็ว ดูแลจนกว่าจะเสร็จสิ้น", icon: "clock", visible: true },
  ];
  const footerConfig: FooterConfig = (homeContent?.footer as any) || {
    title: "velounity",
    description: "A demonstration of modern authentication patterns and best practices",
    links: [
      { label: "Home", href: "/" },
      { label: "Premium", href: "/premium" },
      { label: "Authentication", href: "/auth" },
      { label: "Dashboard", href: "/dashboard" },
    ],
    visible: true,
  };
  const customSections: CustomSectionData[] = ((homeContent?.customSections as any) || [])
    .filter((s: CustomSectionData) => s.visible)
    .sort((a: CustomSectionData, b: CustomSectionData) => a.sort - b.sort);

  // Helper: get section config with defaults
  const sec = (key: string, defaults: SectionConfig): SectionConfig => ({
    ...defaults,
    ...(sections[key] || {}),
  });

  const gamesConfig = sec("games", { title: "เติมเกมยอดนิยม", subtitle: "เติมเกมรวดเร็ว ปลอดภัย ราคาถูก", visible: true, glowColor: "rgba(99, 102, 241, 0.2)", titleColor: "#ffffff" });
  const cardsConfig = sec("cards", { title: "บัตรเติมเงินยอดนิยม", subtitle: "ซื้อบัตรเติมเงินได้ทันที ราคาประหยัด", visible: true, glowColor: "rgba(16, 185, 129, 0.2)", titleColor: "#ffffff" });
  const realProductsConfig = sec("realProducts", { title: "สินค้าบริษัท", subtitle: "สินค้าจริงจากบริษัท คุณภาพดี จัดส่งรวดเร็ว", visible: true, glowColor: "rgba(244, 63, 94, 0.2)", titleColor: "#ffffff" });
  const productsConfig = sec("products", { title: "สินค้าของเรา", subtitle: "สินค้าพร้อมส่งทันที อัปเดตตลอดเวลา ราคาคุ้มค่า", visible: true, glowColor: "rgba(168, 85, 247, 0.2)", titleColor: "#ffffff" });
  const auctionConfig = sec("auction", { title: "สินค้าประมูล", subtitle: "ประมูลสินค้าพิเศษ เสนอราคาที่คุณต้องการ", visible: true, glowColor: "rgba(251, 191, 36, 0.2)", titleColor: "#ffffff" });
  const recentOrdersConfig = sec("recentOrders", { title: "การสั่งซื้อล่าสุด", visible: true });
  const sellItemsConfig = sec("sellItems", { visible: true });
  const articlesConfig = sec("articles", { visible: true });

  // Render custom sections for a given position
  const renderCustomSections = (position: string) =>
    customSections
      .filter((s) => s.position === position)
      .map((s) => (
        <div key={s.id} className="mt-20 md:mt-24">
          <div className="text-center mb-10 md:mb-14 relative">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 blur-[60px] rounded-full -z-10"
              style={{ backgroundColor: s.glowColor }}
            />
            <h2
              className="text-3xl md:text-4xl font-black mb-3 tracking-tight"
              style={{ color: "#ffffff", textShadow: `0 0 30px ${s.glowColor}` }}
            >
              {s.title}
            </h2>
            {s.subtitle && (
              <p className="text-base md:text-lg text-white font-medium">
                {s.subtitle}
              </p>
            )}
          </div>
          <div
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: s.content }}
          />
        </div>
      ));

  return (
    <>
      <div className="relative min-h-screen">
        {/* Hero Banner - Dynamic from database */}
        <DynamicBanner />

        {/* Feature Quick Cards */}


        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">

          {/* Custom sections: before_games */}
          {renderCustomSections("before_games")}

          {/* Games Section */}
          {games.length > 0 && gamesConfig.visible !== false && (
            <div className="mt-8 md:mt-12">
              <div className="text-center mb-10 md:mb-14 relative">
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 blur-[60px] rounded-full -z-10"
                  style={{ backgroundColor: gamesConfig.glowColor }}
                />
                
                <h2
                  className="text-3xl md:text-4xl font-black mb-3 tracking-tight text-glow-blue"
                  style={{ color: gamesConfig.titleColor }}
                >
                  {gamesConfig.title}
                </h2>
                <p className="text-base md:text-lg text-white font-medium">
                  {gamesConfig.subtitle}
                </p>
              </div>
              <HomeGames games={games} />
            </div>
          )}

          {/* Custom sections: after_games */}
          {renderCustomSections("after_games")}

          {/* Cards Section */}
          {cards.length > 0 && cardsConfig.visible !== false && (
            <div className="mt-20 md:mt-24">
              <div className="text-center mb-10 md:mb-14 relative">
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 blur-[60px] rounded-full -z-10"
                  style={{ backgroundColor: cardsConfig.glowColor }}
                />
               
                <h2
                  className="text-3xl md:text-4xl font-black mb-3 tracking-tight text-glow-blue"
                  style={{ color: cardsConfig.titleColor }}
                >
                  {cardsConfig.title}
                </h2>
                <p className="text-base md:text-lg text-white font-medium">
                  {cardsConfig.subtitle}
                </p>
              </div>
              <HomeCards cards={cards} />
            </div>
          )}

          {/* Custom sections: after_cards */}
          {renderCustomSections("after_cards")}

          {/* Real Products Section - สินค้าบริษัท */}
          {realProducts.length > 0 && realProductsConfig.visible !== false && (
            <div className="mt-20 md:mt-24">
              <div className="text-center mb-10 md:mb-14 relative">
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 blur-[60px] rounded-full -z-10"
                  style={{ backgroundColor: realProductsConfig.glowColor }}
                />
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass-panel mb-6 group hover:scale-110 transition-transform duration-300">
                  <Package className="w-8 h-8 text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
                </div>
                <h2
                  className="text-3xl md:text-4xl font-black mb-3 tracking-tight"
                  style={{ color: realProductsConfig.titleColor, textShadow: `0 0 30px ${realProductsConfig.glowColor}` }}
                >
                  {realProductsConfig.title}
                </h2>
                <p className="text-base md:text-lg text-white font-medium">
                  {realProductsConfig.subtitle}
                </p>
              </div>

              <HomeRealProducts items={realProducts} colorConfig={{ cardBgColor: realProductsConfig.cardBgColor, cardTextColor: realProductsConfig.cardTextColor, buttonColor: realProductsConfig.buttonColor, buttonTextColor: realProductsConfig.buttonTextColor }} />
            </div>
          )}

          {/* Custom sections: after_realProducts */}
          {renderCustomSections("after_realProducts")}

          {/* Regular Products Section */}
          {gameItems.filter(item => !item.isAuction).length > 0 && productsConfig.visible !== false && (
            <div className="mt-20 md:mt-24">
              <div className="text-center mb-10 md:mb-14 relative">
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 blur-[60px] rounded-full -z-10"
                  style={{ backgroundColor: productsConfig.glowColor }}
                />
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass-panel mb-6 group hover:scale-110 transition-transform duration-300">
                  <Crown className="w-8 h-8 text-purple-400 drop-shadow-[0_0_10px_rgba(192,132,252,0.5)]" />
                </div>
                <h2
                  className="text-3xl md:text-4xl font-black mb-3 tracking-tight text-glow-purple"
                  style={{ color: productsConfig.titleColor }}
                >
                  {productsConfig.title}
                </h2>
                <p className="text-base md:text-lg text-white font-medium">
                  {productsConfig.subtitle}
                </p>
              </div>

              <Suspense fallback={<ProductsSkeleton />}>
                <HomeGameItems items={gameItems.filter(item => !item.isAuction)} colorConfig={{ cardBgColor: productsConfig.cardBgColor, cardTextColor: productsConfig.cardTextColor, buttonColor: productsConfig.buttonColor, buttonTextColor: productsConfig.buttonTextColor }} />
              </Suspense>
            </div>
          )}

          {/* Custom sections: after_products */}
          {renderCustomSections("after_products")}

          {/* Auction Products Section */}
          {gameItems.filter(item => item.isAuction).length > 0 && auctionConfig.visible !== false && (
            <div className="mt-20 md:mt-24">
              <div className="text-center mb-10 md:mb-14 relative">
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 blur-[60px] rounded-full -z-10"
                  style={{ backgroundColor: auctionConfig.glowColor }}
                />
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass-panel mb-6 group hover:scale-110 transition-transform duration-300">
                  <Gavel className="w-8 h-8 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                </div>
                <h2
                  className="text-3xl md:text-4xl font-black mb-3 tracking-tight"
                  style={{ color: auctionConfig.titleColor, textShadow: `0 0 30px ${auctionConfig.glowColor}` }}
                >
                  {auctionConfig.title}
                </h2>
                <p className="text-base md:text-lg text-white font-medium">
                  {auctionConfig.subtitle}
                </p>
              </div>

              <Suspense fallback={<ProductsSkeleton />}>
                <HomeGameItems items={gameItems.filter(item => item.isAuction)} colorConfig={{ cardBgColor: auctionConfig.cardBgColor, cardTextColor: auctionConfig.cardTextColor, buttonColor: auctionConfig.buttonColor, buttonTextColor: auctionConfig.buttonTextColor }} />
              </Suspense>
            </div>
          )}

          {/* Custom sections: after_auction */}
          {renderCustomSections("after_auction")}

          {/* Recent Orders Section */}
          {recentOrdersConfig.visible !== false && (
            <div className="mt-20 md:mt-24">
              <RecentOrders />
            </div>
          )}

          {/* Custom sections: after_recentOrders */}
          {renderCustomSections("after_recentOrders")}

          {/* Sell Item Form */}
          {sellItemsConfig.visible !== false && <SellItemForm />}

          {/* Articles Section */}
          {articlesConfig.visible !== false && <ArticlesSection />}
        </main>

        {/* Custom sections: before_trustbar */}
        {renderCustomSections("before_trustbar")}

        {/* Trust Bar */}
        {trustBarItems.filter((t) => t.visible).length > 0 && (
          <section className="mt-10 md:mt-16 mb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {trustBarItems
                  .filter((t) => t.visible)
                  .map((item, i) => (
                    <TrustItem key={i} title={item.title} desc={item.desc} icon={item.icon} />
                  ))}
              </div>
            </div>
          </section>
        )}

        {/* Custom sections: after_trustbar */}
        {renderCustomSections("after_trustbar")}

        {/* Footer */}
        {footerConfig.visible !== false && (
          <footer className="border-t border-white/5 bg-slate-950/50 backdrop-blur-xl text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  {footerConfig.title}
                </h3>
                <p className="text-slate-400 mb-8 max-w-md mx-auto">
                  {footerConfig.description}
                </p>
                <div className="flex justify-center gap-8">
                  {footerConfig.links.map((link, i) => (
                    <Link
                      key={i}
                      href={link.href}
                      className="text-slate-400 hover:text-white transition-colors hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </footer>
        )}
      </div>
    </>
  );
}

function TrustItem({ title, desc, icon }: { title: string; desc: string; icon: string }) {
  return (
    <div className="glass-panel p-6 rounded-2xl flex items-center gap-4 hover:bg-white/5 transition-colors group">
      <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
        <i className={`fas fa-${icon} text-indigo-400 text-xl`}></i>
      </div>
      <div>
        <p className="font-bold text-white text-lg">{title}</p>
        <p className="text-sm text-slate-400 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}
