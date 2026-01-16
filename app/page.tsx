import Link from "next/link";
import Image from "next/image";
import { Crown, Gamepad2, CreditCard, Gavel } from "lucide-react";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import RecentOrders from "./components/RecentOrders";
import ArticlesSection from "./components/ArticlesSection";
import SellItemForm from "./components/SellItemForm";
import DynamicBanner from "./components/DynamicBanner";
import HomeGames from "./home-games";
import HomeCards from "./home-cards";

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

// Enable ISR (Incremental Static Regeneration)
export const revalidate = 60;

export default async function Home() {
  // Fetch all data in parallel
  const [gameItems, games, cards] = await Promise.all([
    getGameItems(),
    getFeaturedGames(),
    getCards(),
  ]);

  return (
    <>
      <div className="relative min-h-screen">
        {/* Hero Banner - Dynamic from database */}
        <DynamicBanner />

        {/* Feature Quick Cards */}


        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">

          {/* Games Section */}
          {games.length > 0 && (
            <div className="mt-8 md:mt-12">
              <div className="text-center mb-10 md:mb-14 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-500/20 blur-[60px] rounded-full -z-10" />
                
                <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight text-glow-blue">
                  เติมเกมยอดนิยม
                </h2>
                <p className="text-base md:text-lg text-white font-medium">
                  เติมเกมรวดเร็ว ปลอดภัย ราคาถูก
                </p>
              </div>
              <HomeGames games={games} />
            </div>
          )}

          {/* Cards Section */}
          {cards.length > 0 && (
            <div className="mt-20 md:mt-24">
              <div className="text-center mb-10 md:mb-14 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-emerald-500/20 blur-[60px] rounded-full -z-10" />
               
                <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight text-glow-blue">
                  บัตรเติมเงินยอดนิยม
                </h2>
                <p className="text-base md:text-lg text-white font-medium">
                  ซื้อบัตรเติมเงินได้ทันที ราคาประหยัด
                </p>
              </div>
              <HomeCards cards={cards} />
            </div>
          )}

          {/* Regular Products Section */}
          {gameItems.filter(item => !item.isAuction).length > 0 && (
            <div className="mt-20 md:mt-24">
              <div className="text-center mb-10 md:mb-14 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-500/20 blur-[60px] rounded-full -z-10" />
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass-panel mb-6 group hover:scale-110 transition-transform duration-300">
                  <Crown className="w-8 h-8 text-purple-400 drop-shadow-[0_0_10px_rgba(192,132,252,0.5)]" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight text-glow-purple">
                 สินค้าของเรา
                </h2>
                <p className="text-base md:text-lg text-white font-medium">
                  สินค้าพร้อมส่งทันที อัปเดตตลอดเวลา ราคาคุ้มค่า
                </p>
              </div>

              <Suspense fallback={<ProductsSkeleton />}>
                <HomeGameItems items={gameItems.filter(item => !item.isAuction)} />
              </Suspense>
            </div>
          )}

          {/* Auction Products Section */}
          {gameItems.filter(item => item.isAuction).length > 0 && (
            <div className="mt-20 md:mt-24">
              <div className="text-center mb-10 md:mb-14 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-amber-500/20 blur-[60px] rounded-full -z-10" />
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass-panel mb-6 group hover:scale-110 transition-transform duration-300">
                  <Gavel className="w-8 h-8 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight" style={{ textShadow: '0 0 30px rgba(251,191,36,0.5)' }}>
                 สินค้าประมูล
                </h2>
                <p className="text-base md:text-lg text-white font-medium">
                  ประมูลสินค้าพิเศษ เสนอราคาที่คุณต้องการ
                </p>
              </div>

              <Suspense fallback={<ProductsSkeleton />}>
                <HomeGameItems items={gameItems.filter(item => item.isAuction)} />
              </Suspense>
            </div>
          )}

          {/* Recent Orders Section */}
          <div className="mt-20 md:mt-24">
            <RecentOrders />
          </div>

          {/* Sell Item Form */}
          <SellItemForm />

          {/* Articles Section */}
          <ArticlesSection />
        </main>

        {/* Trust Bar */}
        <section className="mt-10 md:mt-16 mb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <TrustItem title="การันตีความพอใจ" desc="เปลี่ยน/คืนเงินตามเงื่อนไข" icon="shield" />
              <TrustItem title="การชำระเงินปลอดภัย" desc="ปกป้องข้อมูลผู้ใช้เข้มงวด" icon="lock" />
              <TrustItem title="ฝ่ายสนับสนุนฉับไว" desc="ตอบกลับเร็ว ดูแลจนกว่าจะเสร็จสิ้น" icon="clock" />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 bg-slate-950/50 backdrop-blur-xl text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">infinitygamecenter</h3>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                A demonstration of modern authentication patterns and best
                practices 
              </p>
              <div className="flex justify-center gap-8">
                <Link
                  href="/"
                  className="text-slate-400 hover:text-white transition-colors hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                >
                  Home
                </Link>
                <Link
                  href="/premium"
                  className="text-slate-400 hover:text-white transition-colors hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                >
                  Premium
                </Link>
                <Link
                  href="/auth"
                  className="text-slate-400 hover:text-white transition-colors hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                >
                  Authentication
                </Link>
                <Link
                  href="/dashboard"
                  className="text-slate-400 hover:text-white transition-colors hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                >
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
        </footer>
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
