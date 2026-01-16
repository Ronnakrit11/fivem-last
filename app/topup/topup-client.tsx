"use client";

import { useState } from "react";
import { Wallet, ArrowUpCircle, Receipt, Gift } from "lucide-react";
import SlipUpload from "./slip-upload";
import TrueWalletRedeem from "./truewallet-redeem";
import { useBalance } from "@/app/contexts/BalanceContext";

type TabType = "slip" | "truewallet";

export default function TopupClient() {
  const { balance } = useBalance();
  const [activeTab, setActiveTab] = useState<TabType>("slip");

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
      {/* Background Effects - เหมือนหน้าหลัก */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 [background:radial-gradient(600px_400px_at_50%_0%,rgba(99,102,241,0.28),transparent_60%),radial-gradient(520px_360px_at_50%_100%,rgba(147,51,234,0.28),transparent_60%)] opacity-50"></div>
        <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)];background-size:24px_24px,24px_24px;background-position:-1px_-1px; opacity-10"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header - Compact */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#03AC13] backdrop-blur-xl border border-white/30 ring-1 ring-black/5 shadow-lg mb-3">
            <ArrowUpCircle className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">
            เติมเงินเข้าบัญชี
          </h1>
          <p className="text-sm text-gray-300">
            เลือกวิธีการเติมเงินที่สะดวกสำหรับคุณ
          </p>
        </div>

        {/* Current Balance - Compact */}
        <div className="rounded-2xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 ring-1 ring-white/5 shadow-xl mb-6">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-300 mb-1">ยอดเงินคงเหลือ</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                  ฿{balance.toLocaleString()}
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400/20 to-emerald-500/20 backdrop-blur-xl border border-green-400/30 flex items-center justify-center">
                <Wallet className="w-7 h-7 text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="rounded-2xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 ring-1 ring-white/5 shadow-xl p-1">
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => setActiveTab("slip")}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === "slip"
                    ? "bg-[#03AC13] text-white shadow-lg"
                    : "text-gray-400 hover:text-gray-300 hover:bg-white/5"
                }`}
              >
                <Receipt className="w-5 h-5" />
                <span className="text-sm">ยืนยันสลิป</span>
              </button>
              <button
                onClick={() => setActiveTab("truewallet")}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === "truewallet"
                    ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-gray-300 hover:bg-white/5"
                }`}
              >
                <Gift className="w-5 h-5" />
                <span className="text-sm">อั่งเปา TrueWallet</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "slip" && <SlipUpload />}
        {activeTab === "truewallet" && <TrueWalletRedeem />}
      </div>
    </div>
  );
}
