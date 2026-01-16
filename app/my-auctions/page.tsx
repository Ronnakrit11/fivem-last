"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Gavel, Clock, Trophy, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

interface GameItem {
  id: string;
  name: string;
  image: string;
  auctionEndDate: string | null;
}

interface AuctionBid {
  id: string;
  gameItemId: string;
  gameItem: GameItem;
  amount: number;
  status: string;
  createdAt: string;
}

export default function MyAuctionsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [bids, setBids] = useState<AuctionBid[]>([]);

  useEffect(() => {
    fetch("/api/auction-bids")
      .then(res => {
        if (res.status === 401) {
          router.push("/auth");
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          setBids(data.bids || []);
        }
      })
      .catch(err => {
        console.error("Error fetching bids:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "WON":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
            <Trophy className="w-3 h-3 mr-1" />
            ชนะประมูล
          </span>
        );
      case "LOST":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-500/20 text-gray-400 border border-gray-500/30">
            <XCircle className="w-3 h-3 mr-1" />
            ไม่ชนะ
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3 mr-1" />
            รอผลประมูล
          </span>
        );
    }
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  // Calculate stats
  const stats = {
    total: bids.length,
    pending: bids.filter(b => b.status === "PENDING").length,
    won: bids.filter(b => b.status === "WON").length,
    lost: bids.filter(b => b.status === "LOST").length,
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 [background:radial-gradient(600px_400px_at_50%_0%,rgba(245,158,11,0.15),transparent_60%),radial-gradient(520px_360px_at_50%_100%,rgba(234,179,8,0.15),transparent_60%)] opacity-50"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            กลับไปแดชบอร์ด
          </Link>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mr-4 border border-amber-500/30">
              <Gavel className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                การประมูลของฉัน
              </h1>
              <p className="text-gray-400 text-sm">
                รายการประมูลทั้งหมดของคุณ
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
            <p className="text-xs text-gray-400 mb-1">ทั้งหมด</p>
            <p className="text-xl font-bold text-white">
              {loading ? <span className="inline-block w-8 h-6 bg-white/10 rounded animate-pulse" /> : stats.total}
            </p>
          </div>
          
          <div className="bg-amber-500/10 backdrop-blur-xl rounded-xl p-4 border border-amber-500/20">
            <p className="text-xs text-amber-300 mb-1">รอผล</p>
            <p className="text-xl font-bold text-amber-400">
              {loading ? <span className="inline-block w-8 h-6 bg-amber-500/20 rounded animate-pulse" /> : stats.pending}
            </p>
          </div>
          
          <div className="bg-green-500/10 backdrop-blur-xl rounded-xl p-4 border border-green-500/20">
            <p className="text-xs text-green-300 mb-1">ชนะ</p>
            <p className="text-xl font-bold text-green-400">
              {loading ? <span className="inline-block w-8 h-6 bg-green-500/20 rounded animate-pulse" /> : stats.won}
            </p>
          </div>
          
          <div className="bg-gray-500/10 backdrop-blur-xl rounded-xl p-4 border border-gray-500/20">
            <p className="text-xs text-gray-400 mb-1">ไม่ชนะ</p>
            <p className="text-xl font-bold text-gray-400">
              {loading ? <span className="inline-block w-8 h-6 bg-gray-500/20 rounded animate-pulse" /> : stats.lost}
            </p>
          </div>
        </div>

        {/* Bids List */}
        <div className="space-y-4">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/10 rounded-lg animate-pulse" />
                  <div className="flex-1">
                    <div className="h-5 bg-white/10 rounded animate-pulse w-1/3 mb-2" />
                    <div className="h-4 bg-white/10 rounded animate-pulse w-1/4" />
                  </div>
                </div>
              </div>
            ))
          ) : bids.length > 0 ? (
            bids.map((bid) => (
              <div 
                key={bid.id} 
                className={`bg-white/5 backdrop-blur-xl rounded-xl p-4 border transition-all ${
                  bid.status === "WON" 
                    ? "border-green-500/30 bg-green-500/5" 
                    : bid.status === "LOST"
                    ? "border-gray-500/20"
                    : "border-amber-500/20"
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Product Image */}
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center overflow-hidden flex-shrink-0 border border-amber-500/20">
                    {bid.gameItem?.image ? (
                      <img src={bid.gameItem.image} alt={bid.gameItem.name} className="w-full h-full object-cover" />
                    ) : (
                      <Gavel className="w-6 h-6 text-amber-400" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate mb-1">
                      {bid.gameItem?.name || "สินค้าไม่ทราบชื่อ"}
                    </h3>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-amber-400 font-bold">฿{bid.amount.toFixed(0)}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-400 text-xs">{formatDate(bid.createdAt)}</span>
                    </div>
                    {bid.gameItem?.auctionEndDate && (
                      <p className="text-xs text-gray-500 mt-1">
                        จบประมูล: {formatDate(bid.gameItem.auctionEndDate)}
                      </p>
                    )}
                  </div>

                  {/* Status */}
                  <div className="flex-shrink-0">
                    {getStatusBadge(bid.status)}
                  </div>
                </div>

                {/* Winner Message */}
                {bid.status === "WON" && (
                  <div className="mt-3 pt-3 border-t border-green-500/20">
                    <p className="text-sm text-green-400 flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      ยินดีด้วย! คุณชนะการประมูลสินค้านี้ กรุณาติดต่อแอดมินเพื่อดำเนินการต่อ
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-12 border border-white/10 text-center">
              <Gavel className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">คุณยังไม่มีรายการประมูล</p>
              <Link 
                href="/"
                className="text-amber-400 hover:text-amber-300 text-sm font-medium"
              >
                ไปดูสินค้าประมูล →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
