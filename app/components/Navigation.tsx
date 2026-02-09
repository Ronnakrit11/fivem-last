"use client";

import { auth } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, LayoutDashboard, Wallet, LogOut, User, Crown, History, Settings, Gamepad2, CreditCard } from "lucide-react";
import { signOut } from "@/lib/actions/auth-actions";
import { useBalance } from "@/app/contexts/BalanceContext";
import { useTheme } from "@/app/contexts/ThemeContext";

type Session = typeof auth.$Infer.Session;

interface NavigationProps {
  session: Session | null;
  logoUrl?: string | null;
}

export default function Navigation({ session, logoUrl: initialLogoUrl }: NavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { balance } = useBalance();
  const { colors } = useTheme();
  const [userRole, setUserRole] = useState<string>("user");
  const [logoUrl, setLogoUrl] = useState<string | null>(initialLogoUrl || null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => {
    return pathname === path;
  };

  // Fetch user role
  useEffect(() => {
    if (!session) return;

    let mounted = true;

    fetch("/api/user/info")
      .then(res => res.json())
      .then((data) => {
        if (!mounted) return;
        if (data.role) {
          setUserRole(data.role);
        }
      })
      .catch((error) => console.error("Error fetching user data:", error));

    return () => {
      mounted = false;
    };
  }, [session]);

  // Fetch logo from database if not provided via props
  useEffect(() => {
    if (initialLogoUrl) return; // Skip if already provided from server
    
    fetch("/api/website-assets")
      .then(res => res.json())
      .then((data) => {
        if (data.logoUrl) {
          setLogoUrl(data.logoUrl);
        }
      })
      .catch((error) => console.error("Error fetching logo:", error));
  }, [initialLogoUrl]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    // Clear balance from sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('user_balance');
      sessionStorage.removeItem('user_balance_timestamp');
    }
    await signOut();
    router.push("/");
    router.refresh();
  };
  return (
    <header className="sticky top-0 z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="rounded-2xl backdrop-blur-xl border border-white/10 shadow-[0_10px_30px_rgba(2,6,23,0.6)]"
          style={{ backgroundColor: colors.navbarColor }}
        >
          <div className="flex justify-between items-center h-14 px-3 sm:px-4">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt="Logo"
                  width={120}
                  height={120}
                  className="w-auto h-12 object-contain transition-transform group-hover:scale-110"
                  priority
                  quality={100}
                  unoptimized
                />
              ) : (
                <div className="w-12 h-12 bg-slate-700/50 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">IG</span>
                </div>
              )}
            </div>
            <span className="text-lg font-bold text-white hidden sm:inline">
              
            </span>
          </Link>

          <nav className="flex items-center space-x-1">
            <Link
              href="/"
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                color: isActive("/") ? colors.homeButtonActiveText : colors.homeButtonTextColor,
                backgroundColor: isActive("/") ? colors.homeButtonActiveBg : colors.homeButtonBgColor,
              }}
            >
              หน้าหลัก
            </Link>

            {session ? (
              <div className="relative ml-2" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-0"
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={36}
                      height={36}
                      className="w-9 h-9 rounded-full border-2 border-gray-200 object-cover transition-all hover:border-indigo-500"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center border-2 border-indigo-200 transition-all hover:border-indigo-400">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <ChevronDown 
                    className={`w-4 h-4 text-gray-300 transition-transform duration-300 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 rounded-xl bg-slate-900/80 backdrop-blur-xl border border-white/20 shadow-xl ring-1 ring-white/10 py-2 z-[60]">
                    {/* User Info */}
                    <div className="px-4 py-4 border-b border-white/20">
                      <p className="text-sm font-semibold text-white">
                        {session.user.name || "User"}
                      </p>
                      <p className="text-xs text-gray-300 truncate mt-1">
                        {session.user.email}
                      </p>
                    </div>

                    {/* Balance */}
                 

                    {/* Menu Items */}
                    <div className="py-2 space-y-1">
                      {(userRole === "admin" || userRole === "owner") ? (
                        <Link
                          href="/admin"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center px-4 py-2.5 text-sm text-white hover:bg-white/15 transition-colors duration-150 rounded-lg mx-2"
                        >
                          <Settings className="w-4 h-4 mr-3 flex-shrink-0" />
                          <span className="font-medium">จัดการหลังบ้าน</span>
                        </Link>
                      ) : (
                        <Link
                          href="/dashboard"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center px-4 py-2.5 text-sm text-white hover:bg-white/15 transition-colors duration-150 rounded-lg mx-2"
                        >
                          <LayoutDashboard className="w-4 h-4 mr-3 flex-shrink-0" />
                          <span className="font-medium">Dashboard</span>
                        </Link>
                      )}
                   
                   
                    
                   
                      <div className="border-t border-white/10 my-2"></div>
                  
                      <Link
                        href="/app-history"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-white hover:bg-white/15 transition-colors duration-150 rounded-lg mx-2"
                      >
                        <History className="w-4 h-4 mr-3 flex-shrink-0" />
                        <span className="font-medium">ประวัติซื้อสินค้า</span>
                      </Link>
                        <Link
                        href="/my-auctions"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-white hover:bg-white/15 transition-colors duration-150 rounded-lg mx-2"
                      >
                        <History className="w-4 h-4 mr-3 flex-shrink-0" />
                        <span className="font-medium">ประวัติการประมูล</span>
                      </Link>
                      <Link
                        href="/real-product-history"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-white hover:bg-white/15 transition-colors duration-150 rounded-lg mx-2"
                      >
                        <History className="w-4 h-4 mr-3 flex-shrink-0" />
                        <span className="font-medium">ประวัติซื้อสินค้าจริง</span>
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-white/20 pt-2">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-950/30 transition-colors duration-150 rounded-lg mx-2"
                      >
                        <LogOut className="w-4 h-4 mr-3 flex-shrink-0" />
                        <span className="font-medium">ออกจากระบบ</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth"
                className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-white/50 ml-2 dark:text-gray-200 dark:hover:text-white dark:hover:bg-white/10"
              >
                เข้าสู่ระบบ
              </Link>
            )}
          </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
