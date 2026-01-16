"use client";

import { Gamepad2, Calendar, CheckCircle, XCircle, Clock, Package } from "lucide-react";
import Link from "next/link";

interface PurchaseGame {
  id: string;
  playerId: string | null;
  paid: number;
  status: string;
  beforeBalance: number;
  afterBalance: number;
  content: string | null;
  wepayTxnId: string | null;
  wepayTxnMessage: string | null;
  createdAt: Date;
  package?: {
    name: string;
    game: {
      name: string;
    };
  };
  mixPackage?: {
    name: string;
    game: {
      name: string;
    };
  };
  server?: {
    name: string;
  };
}

export default function GameHistoryClient({ purchases }: { purchases: PurchaseGame[] }) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            สำเร็จ
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            รอดำเนินการ
          </span>
        );
      case "FAILED":
      case "REFUND":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            {status === "REFUND" ? "คืนเงิน" : "ล้มเหลว"}
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/80 to-purple-600/80 backdrop-blur-xl border border-white/30 ring-1 ring-black/5 shadow-lg mb-4">
            <Gamepad2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">
            ประวัติการเติมเกม
          </h1>
          <p className="text-sm text-gray-300">ดูประวัติการเติมเกมทั้งหมดของคุณ</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="rounded-2xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 ring-1 ring-white/5 shadow-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-300 mb-1">คำสั่งซื้อทั้งหมด</p>
                <p className="text-2xl font-bold text-white">{purchases.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <Package className="w-6 h-6 text-indigo-300" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-400/30 ring-1 ring-green-400/10 shadow-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-300 mb-1">สำเร็จ</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  {purchases.filter((p) => p.status === "SUCCESS").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-500/30 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-300" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-xl border border-amber-400/30 ring-1 ring-amber-400/10 shadow-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-300 mb-1">ยอดใช้จ่ายทั้งหมด</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  ฿{purchases.filter((p) => p.status === "SUCCESS").reduce((sum, p) => sum + Number(p.paid), 0).toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/30 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-amber-300" />
              </div>
            </div>
          </div>
        </div>

        {/* History List */}
        <div className="rounded-2xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 ring-1 ring-white/5 shadow-xl">
          <div className="px-6 py-4 border-b border-white/10 bg-white/5">
            <h2 className="text-lg font-semibold text-white">รายการคำสั่งซื้อ</h2>
          </div>

          {purchases.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        เกม
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        แพ็คเกจ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        ราคา
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        สถานะ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        วันที่
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {purchases.map((purchase) => (
                      <tr
                        key={purchase.id}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Gamepad2 className="w-5 h-5 text-indigo-300 mr-2" />
                            <div>
                              <div className="text-sm font-medium text-white">
                                {purchase.package?.game?.name || purchase.mixPackage?.game?.name}
                              </div>
                              {purchase.playerId && (
                                <div className="text-xs text-gray-400">
                                  ID: {purchase.playerId}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-white">
                            {purchase.package?.name || purchase.mixPackage?.name}
                          </div>
                          {purchase.server && (
                            <div className="text-xs text-gray-400">
                              Server: {purchase.server.name}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-white">
                            ฿{Number(purchase.paid).toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(purchase.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">
                            {formatDate(purchase.createdAt)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List */}
              <div className="md:hidden divide-y divide-white/10">
                {purchases.map((purchase) => (
                  <div
                    key={purchase.id}
                    className="px-6 py-5 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <Gamepad2 className="w-5 h-5 text-indigo-300 mr-2" />
                        <div>
                          <h3 className="text-sm font-semibold text-white">
                            {purchase.package?.game?.name || purchase.mixPackage?.game?.name}
                          </h3>
                          <p className="text-xs text-gray-400">
                            {purchase.package?.name || purchase.mixPackage?.name}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(purchase.status)}
                    </div>

                    {purchase.playerId && (
                      <div className="text-xs text-gray-400 mb-2">
                        Player ID: {purchase.playerId}
                      </div>
                    )}

                    {purchase.server && (
                      <div className="text-xs text-gray-400 mb-2">
                        Server: {purchase.server.name}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                      <div className="text-xs text-gray-400">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {formatDate(purchase.createdAt)}
                      </div>
                      <div className="text-lg font-bold text-white">
                        ฿{Number(purchase.paid).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="px-6 py-12 text-center">
              <Gamepad2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300 text-lg mb-4">ยังไม่มีประวัติการเติมเกม</p>
              <Link
                href="/games"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
              >
                เติมเกมเลย →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
