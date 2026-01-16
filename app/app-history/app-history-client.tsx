"use client";

import { useState } from "react";
import { History, Package, Calendar, CheckCircle, XCircle, Clock, Eye, X } from "lucide-react";

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

export default function AppHistoryClient({ historyData }: { historyData: AppHistoryItem[] }) {
  const [selectedItem, setSelectedItem] = useState<AppHistoryItem | null>(null);
  const [showModal, setShowModal] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            สำเร็จ
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            รอดำเนินการ
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            ล้มเหลว
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

  const handleViewProduct = (item: AppHistoryItem) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  // Sanitize text to prevent XSS
  const sanitizeText = (text: string): string => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  };

  const extractEmailAndPass = (prize: string) => {
    // Extract email
    const emailMatch = prize.match(/email\s*:\s*([^\s\\]+)/i);
    const email = emailMatch ? sanitizeText(emailMatch[1]) : null;

    // Extract pass
    const passMatch = prize.match(/pass\s*:\s*([^\s\\]+)/i);
    const pass = passMatch ? sanitizeText(passMatch[1]) : null;

    return { email, pass };
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`คัดลอก${label}แล้ว!`);
  };

  return (
    <>
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/80 to-purple-600/80 backdrop-blur-xl border border-white/30 ring-1 ring-black/5 shadow-lg mb-4">
          <History className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-1">
          ประวัติการซื้อแอพ
        </h1>
        <p className="text-sm text-gray-300">ดูประวัติการซื้อแอพพรีเมี่ยมทั้งหมดของคุณ</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 ring-1 ring-white/5 shadow-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-300 mb-1">คำสั่งซื้อทั้งหมด</p>
              <p className="text-2xl font-bold text-white">{historyData.length}</p>
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
                {historyData.filter(h => h.status === "success").length}
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
                ฿{historyData.filter(h => h.status === "success").reduce((sum, h) => sum + h.price, 0).toFixed(2)}
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

        {historyData.length > 0 ? (
          <div className="divide-y divide-white/10">
            {historyData.map((item) => (
              <div
                key={item.id}
                className="px-6 py-5 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-2">
                      <Package className="w-5 h-5 text-indigo-300 mr-2 flex-shrink-0" />
                      <h3 className="text-lg font-semibold text-white truncate">
                        {item.productName}
                      </h3>
                    </div>
                    <div className="flex flex-col space-y-1 text-xs text-gray-300">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                        {formatDate(item.createdAt)}
                      </span>
                      <span className="font-mono text-indigo-300 truncate">
                        รหัสอ้างอิง: {item.reference}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-xl font-bold text-white">
                        ฿{item.price}
                      </p>
                    </div>
                    {getStatusBadge(item.status)}
                    <button
                      onClick={() => handleViewProduct(item)}
                      className="p-2 text-indigo-300 hover:bg-indigo-500/20 rounded-lg transition-colors border border-indigo-400/30"
                      title="ดูข้อมูลสินค้า"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-300 text-lg mb-4">ยังไม่มีประวัติการซื้อ</p>
            <a
              href="/premium"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
            >
              เริ่มซื้อสินค้า →
            </a>
          </div>
        )}
      </div>

      {/* Product Info Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-2xl w-full p-6 relative max-h-[85vh] overflow-y-auto border border-white/20">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-2xl font-bold text-white mb-6">
              ข้อมูลสินค้า
            </h3>

            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <label className="text-xs font-medium text-gray-400 block mb-1">ชื่อสินค้า:</label>
                <p className="text-base font-semibold text-white">{selectedItem.productName}</p>
              </div>

              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <label className="text-xs font-medium text-gray-400 block mb-1">รหัสอ้างอิง:</label>
                <p className="text-base font-mono text-indigo-300">{selectedItem.reference}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <label className="text-xs font-medium text-gray-400 block mb-1">ราคา:</label>
                  <p className="text-lg font-semibold text-white">฿{selectedItem.price}</p>
                </div>

                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <label className="text-xs font-medium text-gray-400 block mb-1">วันที่ซื้อ:</label>
                  <p className="text-sm text-white">{formatDate(selectedItem.createdAt)}</p>
                </div>
              </div>

              {/* Quick Copy Email & Pass */}
              {(() => {
                const { email, pass } = extractEmailAndPass(selectedItem.prize);
                return (email || pass) && (
                  <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-400/30">
                    <p className="text-sm font-medium text-blue-300 mb-3">🔑 คัดลอกด่วน:</p>
                    <div className="flex flex-wrap gap-2">
                      {email && (
                        <button
                          onClick={() => copyToClipboard(email, "Email")}
                          className="flex items-center px-4 py-2 bg-white/5 border border-blue-400/30 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <span className="text-sm font-mono text-white mr-2">{email}</span>
                          <span className="text-xs text-blue-300">📧 คัดลอก</span>
                        </button>
                      )}
                      {pass && (
                        <button
                          onClick={() => copyToClipboard(pass, "Password")}
                          className="flex items-center px-4 py-2 bg-white/5 border border-blue-400/30 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <span className="text-sm font-mono text-white mr-2">{pass}</span>
                          <span className="text-xs text-blue-300">🔒 คัดลอก</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}

              <div className="border-t border-white/10 pt-4">
                <label className="text-sm font-medium text-gray-300 mb-3 block">
                  📦 ข้อมูลสินค้าที่ได้รับ
                </label>
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-400/30">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="text-sm text-white break-words font-mono leading-relaxed">
                      {sanitizeText(selectedItem.prize).split('\\n').map((line, i) => (
                        <span key={i}>
                          <span dangerouslySetInnerHTML={{ __html: line }} />
                          {i < selectedItem.prize.split('\\n').length - 1 && <br />}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedItem.prize.replace(/\\n/g, '\n'));
                        alert("คัดลอกข้อมูลสินค้าแล้ว!");
                      }}
                      className="text-sm text-green-300 hover:text-green-200 font-medium flex items-center transition-colors"
                    >
                      📋 คัดลอกข้อมูล
                    </button>
                    <span className="text-xs text-gray-400">
                      คัดลอกเพื่อใช้งาน
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="mt-6 w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </>
  );
}
