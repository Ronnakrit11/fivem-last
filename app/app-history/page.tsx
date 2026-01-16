"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppHistoryClient from "./app-history-client";
import { Package } from "lucide-react";

interface AppHistoryItem {
  id: string;
  productName: string;
  productId: string;
  prize: string;
  price: number;
  reference: string;
  status: string;
  createdAt: Date;
  image?: string | null;
}

// Loading skeleton component
function LoadingSkeleton() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 [background:radial-gradient(600px_400px_at_50%_0%,rgba(99,102,241,0.28),transparent_60%),radial-gradient(520px_360px_at_50%_100%,rgba(147,51,234,0.28),transparent_60%)] opacity-50"></div>
        <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)];background-size:24px_24px,24px_24px;background-position:-1px_-1px; opacity-10"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Skeleton */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 mb-4 animate-pulse" />
          <div className="h-9 w-64 mx-auto bg-white/10 rounded-lg mb-2 animate-pulse" />
          <div className="h-5 w-80 mx-auto bg-white/10 rounded-lg animate-pulse" />
        </div>

        {/* Summary Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 p-5 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-white/10 rounded w-24 mb-2" />
                  <div className="h-8 bg-white/10 rounded w-16" />
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-full" />
              </div>
            </div>
          ))}
        </div>

        {/* History List Skeleton */}
        <div className="rounded-2xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl animate-pulse">
          <div className="px-6 py-4 border-b border-white/10 bg-white/5">
            <div className="h-6 bg-white/10 rounded w-32" />
          </div>
          <div className="divide-y divide-white/10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="px-6 py-5">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-6 bg-white/10 rounded w-48 mb-2" />
                    <div className="h-4 bg-white/10 rounded w-64" />
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="h-8 bg-white/10 rounded w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AppHistoryPage() {
  const router = useRouter();
  const [historyData, setHistoryData] = useState<AppHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch history from API
    fetch("/api/app-history")
      .then(res => {
        if (res.status === 401) {
          router.push("/auth");
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          setHistoryData(data.data || []);
        }
      })
      .catch(err => {
        console.error("Error fetching history:", err);
        setError("ไม่สามารถโหลดข้อมูลได้");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 [background:radial-gradient(600px_400px_at_50%_0%,rgba(99,102,241,0.28),transparent_60%),radial-gradient(520px_360px_at_50%_100%,rgba(147,51,234,0.28),transparent_60%)] opacity-50"></div>
          <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)];background-size:24px_24px,24px_24px;background-position:-1px_-1px; opacity-10"></div>
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="rounded-2xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl p-8 text-center">
            <Package className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">เกิดข้อผิดพลาด</h2>
            <p className="text-gray-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 [background:radial-gradient(600px_400px_at_50%_0%,rgba(99,102,241,0.28),transparent_60%),radial-gradient(520px_360px_at_50%_100%,rgba(147,51,234,0.28),transparent_60%)] opacity-50"></div>
        <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)];background-size:24px_24px,24px_24px;background-position:-1px_-1px; opacity-10"></div>
      </div>
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AppHistoryClient historyData={historyData} />
      </div>
    </div>
  );
}
