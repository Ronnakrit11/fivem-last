"use client";
import { signOut } from "@/lib/actions/auth-actions";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Wallet, ArrowUpCircle, Crown, ShoppingBag, User, Mail, LogOut, Gavel } from "lucide-react";
import { useBalance } from "@/app/contexts/BalanceContext";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import ProfileModal from "@/app/components/ProfileModal";

type Session = typeof auth.$Infer.Session;

export default function DashboardClientPage({ 
  session
}: { 
  session: Session;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { balance, refreshBalance } = useBalance();
  const user = session.user;
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Check for successful login from OAuth
  useEffect(() => {
    if (searchParams.get('login') === 'success') {
      // Clear old balance and refresh new user's balance
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('user_balance');
        sessionStorage.removeItem('user_balance_timestamp');
      }
      refreshBalance();
      toast.success("เข้าสู่ระบบสำเร็จ");
      // Remove the query parameter from URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
      
      // Accept policy for OAuth login (user already accepted before clicking Google button)
      acceptPolicyForOAuth();
      
      // Check if profile is completed
      checkProfileCompletion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const acceptPolicyForOAuth = async () => {
    try {
      await fetch("/api/user/accept-policy", {
        method: "POST",
      });
    } catch (error) {
      console.error("Error accepting policy:", error);
    }
  };

  // Check profile completion on mount
  useEffect(() => {
    checkProfileCompletion();
  }, []);

  const checkProfileCompletion = async () => {
    try {
      const res = await fetch("/api/user/profile");
      const data = await res.json();
      if (data.success && data.user && !data.user.profileCompleted) {
        setShowProfileModal(true);
      }
    } catch (error) {
      console.error("Error checking profile:", error);
    }
  };

  const handleSignOut = async () => {
    // Clear balance from sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('user_balance');
      sessionStorage.removeItem('user_balance_timestamp');
    }
    await signOut();
    router.push("/auth");
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 [background:radial-gradient(600px_400px_at_50%_0%,rgba(99,102,241,0.28),transparent_60%),radial-gradient(520px_360px_at_50%_100%,rgba(147,51,234,0.28),transparent_60%)] opacity-50"></div>
        <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)];background-size:24px_24px,24px_24px;background-position:-1px_-1px; opacity-10"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-between w-full mb-4">
            <div className="flex-1" />
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/80 to-purple-600/80 backdrop-blur-xl border border-white/30 ring-1 ring-black/5 shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 flex justify-end">
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-300 hover:text-red-200 transition-all text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                ออกจากระบบ
              </button>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">
            แดชบอร์ด
          </h1>
          <p className="text-sm text-gray-300">
            จัดการบัญชีและดูข้อมูลของคุณ
          </p>
        </div>

        {/* User Info Card */}
        <div className="rounded-2xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 ring-1 ring-white/5 shadow-xl mb-6">
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3">
              {/* Name */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-indigo-300" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">ชื่อผู้ใช้</p>
                    <p className="text-sm font-semibold text-white">{user.name || "ไม่ระบุ"}</p>
                  </div>
                </div>
              </div>

              {/* Balance */}
             
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Top Up Button */}
       

          {/* Premium Button */}
      

          {/* Purchase History Button */}
          <Link
            href="/app-history"
            prefetch={true}
            className="group rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500/20 to-cyan-600/20 backdrop-blur-xl border border-blue-400/30 ring-1 ring-blue-400/10 shadow-xl hover:scale-105 transition-transform"
          >
            <div className="p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/30 mb-4 group-hover:bg-blue-500/40 transition-colors">
                <ShoppingBag className="w-6 h-6 text-blue-300" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">ประวัติการซื้อ</h3>
              <p className="text-sm text-gray-300">ดูประวัติการสั่งซื้อของคุณ</p>
            </div>
          </Link>

          {/* Auction History Button */}
          <Link
            href="/my-auctions"
            prefetch={true}
            className="group rounded-2xl overflow-hidden bg-gradient-to-br from-amber-500/20 to-yellow-600/20 backdrop-blur-xl border border-amber-400/30 ring-1 ring-amber-400/10 shadow-xl hover:scale-105 transition-transform"
          >
            <div className="p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/30 mb-4 group-hover:bg-amber-500/40 transition-colors">
                <Gavel className="w-6 h-6 text-amber-300" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">การประมูลของฉัน</h3>
              <p className="text-sm text-gray-300">ดูรายการประมูลและสถานะ</p>
            </div>
          </Link>

          {/* My Sells Button */}
          <Link
            href="/my-sells"
            prefetch={true}
            className="group rounded-2xl overflow-hidden bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-xl border border-green-400/30 ring-1 ring-green-400/10 shadow-xl hover:scale-105 transition-transform"
          >
            <div className="p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-500/30 mb-4 group-hover:bg-green-500/40 transition-colors">
                <ShoppingBag className="w-6 h-6 text-green-300" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">ประวัติการขายของฉัน</h3>
              <p className="text-sm text-gray-300">ดูรายการที่คุณส่งขายให้เรา</p>
            </div>
          </Link>
        </div>

        {/* Info Section */}
        <div className="rounded-2xl overflow-hidden bg-blue-500/10 backdrop-blur-xl border border-blue-400/20 ring-1 ring-blue-400/5 shadow-lg">
          <div className="p-5">
            <h4 className="font-semibold text-blue-300 text-sm mb-3">ข้อมูลบัญชี</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <span className="text-blue-400">•</span>
                <span><strong>User ID:</strong> {user.id.slice(0, 12)}...</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-400">•</span>
                <span><strong>สถานะ:</strong> {user.emailVerified ? "ยืนยันแล้ว" : "ยังไม่ยืนยัน"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onComplete={() => setShowProfileModal(false)}
      />
    </div>
  );
}
