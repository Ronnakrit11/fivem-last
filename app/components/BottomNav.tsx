"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Home, Clock, Briefcase, User, LucideIcon, ShoppingBag, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "@/app/contexts/ThemeContext";

type NavItem = {
  href: string;
  label: string;
  icon?: LucideIcon;
  isCenter?: boolean;
  useLogo?: boolean;
  requireAuth?: boolean;
  isExternal?: boolean;
};

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { colors } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/user/info")
      .then((res) => res.json())
      .then((data) => {
        setIsAuthenticated(!!data.id);
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, []);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleNavClick = (item: NavItem, e: React.MouseEvent) => {
    if (item.requireAuth && isAuthenticated === false) {
      e.preventDefault();
      // Save the intended destination before redirecting to auth
      sessionStorage.setItem('redirectAfterLogin', item.href);
      router.push("/auth");
    }
  };

  const navItems: NavItem[] = [
    {
      href: "/",
      label: "หน้าหลัก",
      icon: Home,
    },
    {
      href: "/app-history",
      label: "ประวัติซื้อ",
      icon: Clock,
      requireAuth: true,
    },
    {
      href: "/my-sells",
      label: "ประวัติขาย",
      icon: ShoppingBag,
      isCenter: true,
      useLogo: false,
      requireAuth: true,
    },
    {
      href: "http://facebook.com/",
      label: "ติดต่อ",
      icon: MessageCircle,
      requireAuth: false,
      isExternal: true,
    },
    {
      href: "/my-auctions",
      label: "ประวัติประมูล",
      icon: User,
      requireAuth: true,
    },
  ];

  return (
    <nav className="md:hidden fixed inset-x-0 bottom-0 z-50 pointer-events-none">
      <div className="mx-3 mb-[calc(env(safe-area-inset-bottom)+10px)] pointer-events-auto">
        <div 
          className="relative rounded-2xl backdrop-blur-xl border border-white/10 shadow-[0_10px_30px_rgba(2,6,23,0.6)]"
          style={{ backgroundColor: colors.bottomNavColor }}
        >
          <div className="grid grid-cols-5 h-16 px-2 isolate">
            {navItems.map((item) => {
              const active = isActive(item.href);

              if (item.isCenter) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleNavClick(item, e)}
                    className="flex flex-col items-center justify-center relative -mt-8 z-20"
                  >
                    <div
                      className={`relative z-10 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                        active
                          ? "bg-black/60"
                          : "bg-black/40"
                      } shadow-lg shadow-black/40 ring-2 ring-white/10`}
                    >
                      
                      {item.useLogo ? (
                        <Image
                          src="/logonew.webp"
                          alt="Logo"
                          width={56}
                          height={56}
                          className="w-7 h-7 object-contain drop-shadow-lg relative z-10"
                          quality={100}
                          unoptimized
                        />
                      ) : (
                        item.icon && <item.icon className="w-6 h-6 text-white drop-shadow-lg relative z-10" />
                      )}
                    </div>

                    <span className="text-[11px] font-medium text-white mt-1.5 z-10">
                      {item.label}
                    </span>
                  </Link>
                );
              }

              const Icon = item.icon;
              
              if (item.isExternal) {
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-10 flex flex-col items-center justify-center space-y-1 py-2 px-2 w-full transition-all duration-200 hover:scale-[1.02]"
                  >
                    {Icon && (
                      <Icon
                        className="w-6 h-6 transition-colors"
                        style={{
                          color: active ? colors.bottomNavActiveIcon : colors.bottomNavIconColor
                        }}
                      />
                    )}
                    <span
                      className="text-[11px] font-medium transition-colors text-center"
                      style={{
                        color: active ? colors.bottomNavActiveText : colors.bottomNavTextColor
                      }}
                    >
                      {item.label}
                    </span>
                    <div
                      className="h-1 w-1 rounded-full mt-0.5 transition-opacity"
                      style={{
                        backgroundColor: active ? colors.bottomNavActiveIcon : 'transparent',
                        opacity: active ? 1 : 0
                      }}
                    />
                  </a>
                );
              }
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(item, e)}
                  className="relative z-10 flex flex-col items-center justify-center space-y-1 py-2 px-2 w-full transition-all duration-200 hover:scale-[1.02]"
                >
                  {Icon && (
                    <Icon
                      className="w-6 h-6 transition-colors"
                      style={{
                        color: active ? colors.bottomNavActiveIcon : colors.bottomNavIconColor
                      }}
                    />
                  )}
                  <span
                    className="text-[11px] font-medium transition-colors text-center"
                    style={{
                      color: active ? colors.bottomNavActiveText : colors.bottomNavTextColor
                    }}
                  >
                    {item.label}
                  </span>
                  <div
                    className="h-1 w-1 rounded-full mt-0.5 transition-opacity"
                    style={{
                      backgroundColor: active ? colors.bottomNavActiveIcon : 'transparent',
                      opacity: active ? 1 : 0
                    }}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
