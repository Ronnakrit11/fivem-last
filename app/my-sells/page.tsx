"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingBag, CheckCircle, XCircle, Clock, Package, Image as ImageIcon, Link as LinkIcon, Loader2, Save } from "lucide-react";
import Link from "next/link";

interface SellItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string | null;
  status: string;
  adminNote: string | null;
  adminSlipImage: string | null;
  downloadLink: string | null;
  createdAt: Date;
}

export default function MySellsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sellItems, setSellItems] = useState<SellItem[]>([]);
  const [editingLink, setEditingLink] = useState<string | null>(null);
  const [linkValue, setLinkValue] = useState("");
  const [savingLink, setSavingLink] = useState(false);
  const [showSlipModal, setShowSlipModal] = useState(false);
  const [slipImageUrl, setSlipImageUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/user-sell")
      .then(res => {
        if (res.status === 401) {
          router.push("/auth");
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          setSellItems(data.sellItems || []);
        }
      })
      .catch(err => {
        console.error("Error fetching sell items:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  const saveDownloadLink = async (itemId: string) => {
    setSavingLink(true);
    try {
      const res = await fetch(`/api/user-sell/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ downloadLink: linkValue }),
      });
      const data = await res.json();
      if (data.success) {
        setSellItems(prev => prev.map(item => item.id === itemId ? { ...item, downloadLink: linkValue || null } : item));
        setEditingLink(null);
        alert("บันทึกลิงก์ดาวน์โหลดสำเร็จ");
      } else {
        alert(data.error || "เกิดข้อผิดพลาด");
      }
    } catch {
      alert("เกิดข้อผิดพลาด");
    } finally {
      setSavingLink(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            อนุมัติแล้ว
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            <Clock className="w-3 h-3 mr-1" />
            รอตรวจสอบ
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
            <XCircle className="w-3 h-3 mr-1" />
            ปฏิเสธ
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-500/20 text-gray-400 border border-gray-500/30">
            {status}
          </span>
        );
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const stats = {
    total: sellItems.length,
    pending: sellItems.filter(i => i.status === "PENDING").length,
    approved: sellItems.filter(i => i.status === "APPROVED").length,
    rejected: sellItems.filter(i => i.status === "REJECTED").length,
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 [background:radial-gradient(600px_400px_at_50%_0%,rgba(34,197,94,0.15),transparent_60%)] opacity-50"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            กลับไปหน้า Dashboard
          </Link>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mr-4 border border-green-500/30">
              <ShoppingBag className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                ประวัติการขายของฉัน
              </h1>
              <p className="text-gray-400">
                รายการสินค้าที่คุณส่งขายให้เรา ({sellItems.length} รายการ)
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <div className="rounded-xl p-4 bg-white/5 border border-white/10 backdrop-blur-xl">
            <p className="text-xs text-gray-400 mb-1">ทั้งหมด</p>
            <p className="text-2xl font-bold text-white">
              {loading ? <span className="inline-block w-8 h-6 bg-white/10 rounded animate-pulse" /> : stats.total}
            </p>
          </div>
          
          <div className="rounded-xl p-4 bg-white/5 border border-white/10 backdrop-blur-xl">
            <p className="text-xs text-gray-400 mb-1">รอตรวจสอบ</p>
            <p className="text-2xl font-bold text-yellow-400">
              {loading ? <span className="inline-block w-8 h-6 bg-white/10 rounded animate-pulse" /> : stats.pending}
            </p>
          </div>
          
          <div className="rounded-xl p-4 bg-white/5 border border-white/10 backdrop-blur-xl">
            <p className="text-xs text-gray-400 mb-1">อนุมัติแล้ว</p>
            <p className="text-2xl font-bold text-green-400">
              {loading ? <span className="inline-block w-8 h-6 bg-white/10 rounded animate-pulse" /> : stats.approved}
            </p>
          </div>
          
          <div className="rounded-xl p-4 bg-white/5 border border-white/10 backdrop-blur-xl">
            <p className="text-xs text-gray-400 mb-1">ปฏิเสธ</p>
            <p className="text-2xl font-bold text-red-400">
              {loading ? <span className="inline-block w-8 h-6 bg-white/10 rounded animate-pulse" /> : stats.rejected}
            </p>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-4">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="rounded-xl p-4 bg-white/5 border border-white/10 backdrop-blur-xl">
                <div className="h-6 bg-white/10 rounded animate-pulse w-1/3 mb-2" />
                <div className="h-4 bg-white/10 rounded animate-pulse w-1/2" />
              </div>
            ))
          ) : sellItems.length > 0 ? (
            sellItems.map((item) => (
              <div 
                key={item.id} 
                className="rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Product Image */}
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center overflow-hidden flex-shrink-0 border border-green-500/20">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-6 h-6 text-green-400" />
                      )}
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-white">{item.name}</h3>
                          <p className="text-sm text-gray-400 line-clamp-2 mt-1">{item.description}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-lg font-bold text-green-400">฿{item.price?.toFixed(0) || 0}</p>
                          <div className="mt-1">{getStatusBadge(item.status)}</div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">{formatDate(item.createdAt)}</p>
                      
                      {/* Admin Note */}
                      {item.adminNote && (
                        <div className="mt-3 p-3 rounded-lg bg-white/5 border border-white/10">
                          <p className="text-xs text-gray-400 mb-1">หมายเหตุจากแอดมิน:</p>
                          <p className="text-sm text-white">{item.adminNote}</p>
                        </div>
                      )}

                      {/* Admin Slip Image */}
                      {item.adminSlipImage && item.status === "APPROVED" && (
                        <div className="mt-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                          <p className="text-xs text-green-400 mb-2 flex items-center gap-1">
                            <ImageIcon className="w-3 h-3" />
                            สลิปการโอนเงินจากแอดมิน
                          </p>
                          <img
                            src={item.adminSlipImage}
                            alt="Admin Slip"
                            className="w-full max-w-[200px] rounded-lg border border-green-500/30 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => {
                              setSlipImageUrl(item.adminSlipImage);
                              setShowSlipModal(true);
                            }}
                          />
                          <p className="text-xs text-gray-500 mt-1">คลิกเพื่อดูรูปขนาดเต็ม</p>
                        </div>
                      )}

                      {/* Download Link */}
                      <div className="mt-3 p-3 rounded-lg bg-white/5 border border-white/10">
                        <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                          <LinkIcon className="w-3 h-3" />
                          ลิงก์ดาวน์โหลด
                        </p>
                        {editingLink === item.id ? (
                          <div className="flex gap-2">
                            <input
                              type="url"
                              value={linkValue}
                              onChange={(e) => setLinkValue(e.target.value)}
                              placeholder="https://..."
                              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                            <button
                              onClick={() => saveDownloadLink(item.id)}
                              disabled={savingLink}
                              className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 flex items-center gap-1"
                            >
                              {savingLink ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                              บันทึก
                            </button>
                            <button
                              onClick={() => setEditingLink(null)}
                              className="px-3 py-2 bg-white/10 text-gray-300 rounded-lg text-sm hover:bg-white/20"
                            >
                              ยกเลิก
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            {item.downloadLink ? (
                              <a
                                href={item.downloadLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 underline break-all text-sm flex-1"
                              >
                                {item.downloadLink}
                              </a>
                            ) : (
                              <span className="text-sm text-gray-500 italic flex-1">ยังไม่ได้ใส่ลิงก์</span>
                            )}
                            <button
                              onClick={() => {
                                setEditingLink(item.id);
                                setLinkValue(item.downloadLink || "");
                              }}
                              className="px-3 py-1.5 bg-white/10 text-gray-300 rounded-lg text-xs hover:bg-white/20 flex items-center gap-1 flex-shrink-0"
                            >
                              <LinkIcon className="w-3 h-3" />
                              {item.downloadLink ? "แก้ไข" : "เพิ่มลิงก์"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl p-12 bg-white/5 border border-white/10 backdrop-blur-xl text-center">
              <ShoppingBag className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">คุณยังไม่มีรายการขาย</p>
              <Link 
                href="/"
                className="inline-block mt-4 px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                ไปขายสินค้า
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Slip Image Fullscreen Modal */}
      {showSlipModal && slipImageUrl && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 cursor-pointer"
          onClick={() => setShowSlipModal(false)}
        >
          <div className="max-w-2xl w-full max-h-[90vh] overflow-auto">
            <img
              src={slipImageUrl}
              alt="สลิปการโอนเงิน"
              className="w-full rounded-lg"
            />
            <p className="text-center text-gray-400 text-sm mt-3">คลิกเพื่อปิด</p>
          </div>
        </div>
      )}
    </div>
  );
}
