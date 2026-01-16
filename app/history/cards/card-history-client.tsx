"use client";

import { CreditCard, Calendar, CheckCircle, XCircle, Clock, Package, Eye, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface PurchaseCard {
  id: string;
  amount: number;
  paid: number;
  status: string;
  beforeBalance: number;
  afterBalance: number;
  content: string | null;
  wepayTxnId: string | null;
  wepayTxnMessage: string | null;
  createdAt: Date;
  cardOption?: {
    name: string;
    card: {
      name: string;
    };
  };
}

export default function CardHistoryClient({ purchases }: { purchases: PurchaseCard[] }) {
  const [selectedItem, setSelectedItem] = useState<PurchaseCard | null>(null);
  const [showModal, setShowModal] = useState(false);

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

  const handleViewDetails = (item: PurchaseCard) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500/80 to-emerald-600/80 backdrop-blur-xl border border-white/30 ring-1 ring-black/5 shadow-lg mb-4">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">
            ประวัติการซื้อบัตรเติมเงิน
          </h1>
          <p className="text-sm text-gray-300">ดูประวัติการซื้อบัตรเติมเงินทั้งหมดของคุณ</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="rounded-2xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 ring-1 ring-white/5 shadow-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-300 mb-1">คำสั่งซื้อทั้งหมด</p>
                <p className="text-2xl font-bold text-white">{purchases.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Package className="w-6 h-6 text-green-300" />
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
                        บัตรเติมเงิน
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        ประเภท
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
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        จัดการ
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
                            <CreditCard className="w-5 h-5 text-green-300 mr-2" />
                            <div className="text-sm font-medium text-white">
                              {purchase.cardOption?.card?.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-white">
                            {purchase.cardOption?.name}
                          </div>
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleViewDetails(purchase)}
                            className="p-2 text-green-300 hover:bg-green-500/20 rounded-lg transition-colors border border-green-400/30"
                            title="ดูรายละเอียด"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
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
                        <CreditCard className="w-5 h-5 text-green-300 mr-2" />
                        <div>
                          <h3 className="text-sm font-semibold text-white">
                            {purchase.cardOption?.card?.name}
                          </h3>
                          <p className="text-xs text-gray-400">
                            {purchase.cardOption?.name}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(purchase.status)}
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                      <div className="text-xs text-gray-400">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {formatDate(purchase.createdAt)}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-lg font-bold text-white">
                          ฿{Number(purchase.paid).toFixed(2)}
                        </div>
                        <button
                          onClick={() => handleViewDetails(purchase)}
                          className="p-2 text-green-300 hover:bg-green-500/20 rounded-lg transition-colors border border-green-400/30"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="px-6 py-12 text-center">
              <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300 text-lg mb-4">ยังไม่มีประวัติการซื้อบัตรเติมเงิน</p>
              <Link
                href="/cards"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
              >
                ซื้อบัตรเติมเงินเลย →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-2xl w-full p-6 relative max-h-[85vh] overflow-y-auto border border-white/20">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-2xl font-bold text-white mb-6">
              รายละเอียดบัตรเติมเงิน
            </h3>

            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <label className="text-xs font-medium text-gray-400 block mb-1">บัตรเติมเงิน:</label>
                <p className="text-base font-semibold text-white">
                  {selectedItem.cardOption?.card?.name}
                </p>
              </div>

              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <label className="text-xs font-medium text-gray-400 block mb-1">ประเภท:</label>
                <p className="text-base font-semibold text-white">
                  {selectedItem.cardOption?.name}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <label className="text-xs font-medium text-gray-400 block mb-1">ราคา:</label>
                  <p className="text-lg font-semibold text-white">
                    ฿{Number(selectedItem.paid).toFixed(2)}
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <label className="text-xs font-medium text-gray-400 block mb-1">สถานะ:</label>
                  <div className="mt-1">{getStatusBadge(selectedItem.status)}</div>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <label className="text-xs font-medium text-gray-400 block mb-1">วันที่:</label>
                <p className="text-sm text-white">{formatDate(selectedItem.createdAt)}</p>
              </div>

              {selectedItem.content && selectedItem.status === "SUCCESS" && (
                <div className="border-t border-white/10 pt-4">
                  <label className="text-sm font-medium text-gray-300 mb-3 block">
                    💳 ข้อมูลบัตรที่ได้รับ
                  </label>
                  <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-400/30">
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="text-sm text-white break-words font-mono leading-relaxed whitespace-pre-wrap">
                        {selectedItem.content}
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(selectedItem.content || '');
                          alert("คัดลอกข้อมูลบัตรแล้ว!");
                        }}
                        className="text-sm text-green-300 hover:text-green-200 font-medium flex items-center transition-colors"
                      >
                        📋 คัดลอกข้อมูล
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="mt-6 w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
