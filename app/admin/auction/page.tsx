"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Gavel, User, CheckCircle, XCircle, Search, Clock, Loader2, Trophy, Upload, Image as ImageIcon, Download, FileCheck, X } from "lucide-react";
import Link from "next/link";

interface AuctionBid {
  id: string;
  gameItemId: string;
  userId: string;
  amount: number;
  status: string;
  slipImage: string | null;
  adminSlipImage: string | null;
  downloadFile: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface AuctionItem {
  id: string;
  name: string;
  description: string;
  image: string;
  auctionEndDate: string | null;
  isActive: boolean;
  auctionBids: AuctionBid[];
}

export default function AuctionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<AuctionItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [selectedBid, setSelectedBid] = useState<AuctionBid | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [uploadingSlip, setUploadingSlip] = useState(false);
  const [adminSlipUrl, setAdminSlipUrl] = useState<string | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [downloadFileUrl, setDownloadFileUrl] = useState<string | null>(null);
  const [showSlipPreview, setShowSlipPreview] = useState(false);
  const [slipPreviewUrl, setSlipPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/auction-bids")
      .then(res => {
        if (res.status === 401) {
          router.push("/auth");
          return null;
        }
        if (res.status === 403) {
          router.push("/dashboard");
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          setItems(data.items || []);
        }
      })
      .catch(err => {
        console.error("Error fetching auction items:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  const refreshData = async () => {
    const res = await fetch("/api/admin/auction-bids");
    const data = await res.json();
    if (data.success) {
      setItems(data.items || []);
    }
  };

  const openBidModal = (bid: AuctionBid) => {
    setSelectedBid(bid);
    setAdminSlipUrl(bid.adminSlipImage || null);
    setDownloadFileUrl(bid.downloadFile || null);
    setShowModal(true);
  };

  const closeBidModal = () => {
    setShowModal(false);
    setSelectedBid(null);
    setAdminSlipUrl(null);
    setDownloadFileUrl(null);
  };

  const handleAdminSlipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingSlip(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/auction-bids/upload-slip", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setAdminSlipUrl(data.url);
      } else {
        alert(data.error || "อัปโหลดไม่สำเร็จ");
      }
    } catch {
      alert("เกิดข้อผิดพลาดในการอัปโหลด");
    } finally {
      setUploadingSlip(false);
    }
  };

  const handleDownloadFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/auction-bids/upload-file", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setDownloadFileUrl(data.url);
      } else {
        alert(data.error || "อัปโหลดไม่สำเร็จ");
      }
    } catch {
      alert("เกิดข้อผิดพลาดในการอัปโหลด");
    } finally {
      setUploadingFile(false);
    }
  };

  const approveWinner = async (bidId: string) => {
    setUpdating(bidId);
    try {
      const res = await fetch(`/api/admin/auction-bids/${bidId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "WON" }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshData();
        alert("อนุมัติผู้ชนะประมูลสำเร็จ");
      } else {
        alert(data.error || "เกิดข้อผิดพลาด");
      }
    } catch {
      alert("เกิดข้อผิดพลาด");
    } finally {
      setUpdating(null);
    }
  };

  const updateBidStatus = async (bidId: string, status: string) => {
    setUpdating(bidId);
    try {
      const payload: Record<string, string | null> = { status };
      if (adminSlipUrl) payload.adminSlipImage = adminSlipUrl;
      if (downloadFileUrl) payload.downloadFile = downloadFileUrl;

      const res = await fetch(`/api/admin/auction-bids/${bidId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        await refreshData();
        closeBidModal();
        alert(data.message || "อัปเดตสำเร็จ");
      } else {
        alert(data.error || "เกิดข้อผิดพลาด");
      }
    } catch {
      alert("เกิดข้อผิดพลาด");
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "WON":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            <Trophy className="w-3 h-3 mr-1" />
            ชนะ - รอชำระเงิน
          </span>
        );
      case "PAID":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            <ImageIcon className="w-3 h-3 mr-1" />
            แนบสลิปแล้ว - รอตรวจสอบ
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            เสร็จสิ้น
          </span>
        );
      case "LOST":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
            <XCircle className="w-3 h-3 mr-1" />
            ไม่ชนะ
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            รอผล
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

  const isAuctionEnded = (endDate: string | null) => {
    if (!endDate) return false;
    return new Date(endDate) < new Date();
  };

  // Filter items
  const filteredItems = items.filter(item => {
    return (
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.auctionBids.some(bid => 
        bid.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bid.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  });

  // Calculate stats
  const stats = {
    total: items.length,
    active: items.filter(i => i.isActive && !isAuctionEnded(i.auctionEndDate)).length,
    ended: items.filter(i => isAuctionEnded(i.auctionEndDate)).length,
    totalBids: items.reduce((sum, i) => sum + i.auctionBids.length, 0),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            กลับไปหน้าจัดการ
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mr-4">
                <Gavel className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  จัดการการประมูล
                </h1>
                <p className="text-gray-600">
                  รายการประมูลทั้งหมดในระบบ ({filteredItems.length} รายการ)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">สินค้าประมูลทั้งหมด</p>
            <p className="text-2xl font-bold text-gray-900">
              {loading ? <span className="inline-block w-12 h-6 bg-gray-200 rounded animate-pulse" /> : stats.total}
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">กำลังประมูล</p>
            <p className="text-2xl font-bold text-amber-600">
              {loading ? <span className="inline-block w-12 h-6 bg-gray-200 rounded animate-pulse" /> : stats.active}
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">จบประมูลแล้ว</p>
            <p className="text-2xl font-bold text-green-600">
              {loading ? <span className="inline-block w-12 h-6 bg-gray-200 rounded animate-pulse" /> : stats.ended}
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">จำนวนการประมูลทั้งหมด</p>
            <p className="text-2xl font-bold text-indigo-600">
              {loading ? <span className="inline-block w-12 h-6 bg-gray-200 rounded animate-pulse" /> : stats.totalBids}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหา ชื่อสินค้า, ชื่อผู้ประมูล, อีเมล..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Auction Items */}
        <div className="space-y-6">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3 mb-4" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
              </div>
            ))
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item) => {
              const highestBid = item.auctionBids[0];
              const hasWinner = item.auctionBids.some(b => b.status === "WON");
              const ended = isAuctionEnded(item.auctionEndDate);

              return (
                <div key={item.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  {/* Item Header */}
                  <div 
                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Image */}
                      <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <Gavel className="w-8 h-8 text-amber-600" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                          {ended ? (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">จบแล้ว</span>
                          ) : (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">กำลังประมูล</span>
                          )}
                          {hasWinner && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">มีผู้ชนะ</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mb-2">
                          {item.auctionEndDate && `จบประมูล: ${formatDate(item.auctionEndDate)}`}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-600">
                            ผู้ประมูล: <span className="font-semibold text-indigo-600">{item.auctionBids.length}</span> คน
                          </span>
                          {highestBid && (
                            <span className="text-gray-600">
                              ราคาสูงสุด: <span className="font-semibold text-green-600">฿{highestBid.amount.toFixed(0)}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Expand Icon */}
                      <div className="text-gray-400">
                        <svg className={`w-5 h-5 transition-transform ${expandedItem === item.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Bids List */}
                  {expandedItem === item.id && (
                    <div className="border-t border-gray-200">
                      <div className="p-4 bg-gray-50">
                        <h4 className="font-medium text-gray-700 mb-3">รายการผู้ประมูล ({item.auctionBids.length})</h4>
                        {item.auctionBids.length > 0 ? (
                          <div className="space-y-3">
                            {item.auctionBids.map((bid, index) => (
                              <div 
                                key={bid.id} 
                                className={`flex items-center justify-between p-4 rounded-lg ${
                                  index === 0 ? 'bg-amber-50 border border-amber-200' : 'bg-white border border-gray-200'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    index === 0 ? 'bg-amber-200 text-amber-700' : 'bg-gray-200 text-gray-600'
                                  }`}>
                                    {index === 0 ? <Trophy className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">{bid.user?.name || '-'}</p>
                                    <p className="text-xs text-gray-500">{bid.user?.email || '-'}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="text-right">
                                    <p className={`font-bold ${index === 0 ? 'text-amber-600' : 'text-gray-700'}`}>
                                      ฿{bid.amount.toFixed(0)}
                                    </p>
                                    <p className="text-xs text-gray-500">{formatDate(bid.createdAt)}</p>
                                  </div>
                                  <div className="min-w-[100px] text-right">
                                    {getStatusBadge(bid.status)}
                                  </div>
                                  {/* Payment info indicator */}
                                  {bid.slipImage && (
                                    <span className="text-xs text-blue-600 flex items-center gap-1">
                                      {bid.slipImage.startsWith("http") ? (
                                        <><ImageIcon className="w-3 h-3" /> สลิป</>
                                      ) : bid.slipImage.includes("Visa") || bid.slipImage.includes("Mastercard") ? (
                                        <><span>💳</span> บัตร</>
                                      ) : bid.slipImage.includes("Bitcoin") ? (
                                        <><span>₿</span> Bitcoin</>
                                      ) : (
                                        <><ImageIcon className="w-3 h-3" /> ข้อมูลชำระ</>
                                      )}
                                    </span>
                                  )}
                                  {!bid.slipImage && bid.adminSlipImage && (
                                    <span className="text-xs text-blue-600 flex items-center gap-1">
                                      <ImageIcon className="w-3 h-3" />
                                      สลิป
                                    </span>
                                  )}
                                  {/* Approve Button - show for all pending bids if no winner yet */}
                                  {!hasWinner && bid.status === "PENDING" && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm(`ต้องการอนุมัติให้ "${bid.user?.name}" เป็นผู้ชนะประมูลหรือไม่?\n\nราคา: ฿${bid.amount.toFixed(0)}`)) {
                                          approveWinner(bid.id);
                                        }
                                      }}
                                      disabled={updating === bid.id}
                                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 flex items-center gap-1"
                                    >
                                      {updating === bid.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <CheckCircle className="w-4 h-4" />
                                      )}
                                      อนุมัติ
                                    </button>
                                  )}
                                  {/* Manage Button - show for WON, PAID bids */}
                                  {(bid.status === "WON" || bid.status === "PAID" || bid.status === "COMPLETED") && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openBidModal(bid);
                                      }}
                                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-1"
                                    >
                                      <FileCheck className="w-4 h-4" />
                                      จัดการ
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-center py-4">ยังไม่มีผู้ประมูล</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
              <Gavel className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">ไม่พบรายการประมูล</p>
            </div>
          )}
        </div>
      </div>

      {/* Bid Detail Modal */}
      {showModal && selectedBid && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-bold text-gray-900">จัดการผู้ชนะประมูล</h3>
                <p className="text-sm text-gray-500">{selectedBid.user?.name || "-"} ({selectedBid.user?.email || "-"})</p>
              </div>
              <button onClick={closeBidModal} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Bid Info */}
              <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div>
                  <p className="text-sm text-gray-600">ราคาประมูล</p>
                  <p className="text-xl font-bold text-amber-600">฿{selectedBid.amount.toFixed(0)}</p>
                </div>
                <div>{getStatusBadge(selectedBid.status)}</div>
              </div>

              {/* User Payment Info / Slip Image */}
              {selectedBid.slipImage && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  {selectedBid.slipImage.startsWith("http") ? (
                    <>
                      <p className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-1">
                        <ImageIcon className="w-4 h-4" />
                        สลิปจาก User
                      </p>
                      <img
                        src={selectedBid.slipImage}
                        alt="User Slip"
                        className="w-full max-w-[250px] rounded-lg border border-blue-300 cursor-pointer hover:opacity-80"
                        onClick={() => {
                          setSlipPreviewUrl(selectedBid.slipImage);
                          setShowSlipPreview(true);
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-1">คลิกเพื่อดูขนาดเต็ม</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-1">
                        💳 ข้อมูลการชำระเงินจาก User
                      </p>
                      <div className="space-y-1.5">
                        {selectedBid.slipImage.split(" | ").map((info, i) => (
                          <p key={i} className="text-sm text-gray-700 bg-white px-3 py-1.5 rounded border border-blue-100">
                            {info}
                          </p>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Admin Slip Upload */}
              {(selectedBid.status === "WON" || selectedBid.status === "PAID") && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-800 mb-2 flex items-center gap-1">
                    <Upload className="w-4 h-4" />
                    แนบสลิปโอนเงิน (แอดมิน)
                  </p>
                  {adminSlipUrl ? (
                    <div className="space-y-2">
                      <img
                        src={adminSlipUrl}
                        alt="Admin Slip"
                        className="w-full max-w-[250px] rounded-lg border border-gray-300 cursor-pointer hover:opacity-80"
                        onClick={() => {
                          setSlipPreviewUrl(adminSlipUrl);
                          setShowSlipPreview(true);
                        }}
                      />
                      <button
                        onClick={() => setAdminSlipUrl(null)}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        ลบรูป
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                      {uploadingSlip ? (
                        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                      ) : (
                        <>
                          <Upload className="w-5 h-5 text-gray-400" />
                          <span className="text-sm text-gray-600">เลือกรูปสลิป</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleAdminSlipUpload}
                        className="hidden"
                        disabled={uploadingSlip}
                      />
                    </label>
                  )}
                  <p className="text-xs text-gray-500 mt-1">กรณีแอดมินโอนเงินเอง สามารถแนบสลิปได้ที่นี่</p>
                </div>
              )}

              {/* Admin Slip Display (for COMPLETED) */}
              {selectedBid.status === "COMPLETED" && selectedBid.adminSlipImage && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-800 mb-2 flex items-center gap-1">
                    <ImageIcon className="w-4 h-4" />
                    สลิปจากแอดมิน
                  </p>
                  <img
                    src={selectedBid.adminSlipImage}
                    alt="Admin Slip"
                    className="w-full max-w-[250px] rounded-lg border border-green-300 cursor-pointer hover:opacity-80"
                    onClick={() => {
                      setSlipPreviewUrl(selectedBid.adminSlipImage);
                      setShowSlipPreview(true);
                    }}
                  />
                </div>
              )}

              {/* Download File Upload - show when PAID or WON (admin wants to complete) */}
              {(selectedBid.status === "PAID" || selectedBid.status === "WON") && (
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm font-medium text-purple-800 mb-2 flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    ไฟล์ดาวน์โหลดสำหรับ User
                  </p>
                  {downloadFileUrl ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 bg-white rounded border border-purple-200">
                        <FileCheck className="w-4 h-4 text-purple-600" />
                        <a href={downloadFileUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-600 hover:underline break-all flex-1">
                          {downloadFileUrl.split("/").pop()}
                        </a>
                      </div>
                      <button
                        onClick={() => setDownloadFileUrl(null)}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        ลบไฟล์
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-purple-300 rounded-lg cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors">
                      {uploadingFile ? (
                        <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                      ) : (
                        <>
                          <Upload className="w-5 h-5 text-purple-400" />
                          <span className="text-sm text-purple-600">เลือกไฟล์ดาวน์โหลด</span>
                        </>
                      )}
                      <input
                        type="file"
                        onChange={handleDownloadFileUpload}
                        className="hidden"
                        disabled={uploadingFile}
                      />
                    </label>
                  )}
                  <p className="text-xs text-gray-500 mt-1">ไฟล์นี้จะแสดงให้ User ดาวน์โหลดหลังยืนยันการชำระเงิน</p>
                </div>
              )}

              {/* Download File Display (for COMPLETED) */}
              {selectedBid.status === "COMPLETED" && selectedBid.downloadFile && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-800 mb-2 flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    ไฟล์ดาวน์โหลด (ส่งให้ User แล้ว)
                  </p>
                  <a href={selectedBid.downloadFile} target="_blank" rel="noopener noreferrer" className="text-sm text-green-600 hover:underline break-all">
                    {selectedBid.downloadFile.split("/").pop()}
                  </a>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                {/* WON status: admin can mark as PAID (with admin slip) or COMPLETED (with slip + file) */}
                {selectedBid.status === "WON" && (
                  <>
                    {adminSlipUrl && (
                      <button
                        onClick={() => updateBidStatus(selectedBid.id, "PAID")}
                        disabled={updating === selectedBid.id}
                        className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {updating === selectedBid.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                        บันทึกสลิป (แอดมินโอนเอง)
                      </button>
                    )}
                    {(adminSlipUrl || selectedBid.slipImage) && downloadFileUrl && (
                      <button
                        onClick={() => updateBidStatus(selectedBid.id, "COMPLETED")}
                        disabled={updating === selectedBid.id}
                        className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {updating === selectedBid.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        ยืนยันและส่งไฟล์
                      </button>
                    )}
                  </>
                )}

                {/* PAID status: admin confirms payment and attaches download file */}
                {selectedBid.status === "PAID" && (
                  <button
                    onClick={() => updateBidStatus(selectedBid.id, "COMPLETED")}
                    disabled={updating === selectedBid.id || !downloadFileUrl}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {updating === selectedBid.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    {downloadFileUrl ? "ยืนยันการชำระเงินและส่งไฟล์" : "กรุณาอัปโหลดไฟล์ดาวน์โหลดก่อน"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Slip Preview Modal */}
      {showSlipPreview && slipPreviewUrl && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4 cursor-pointer"
          onClick={() => setShowSlipPreview(false)}
        >
          <div className="max-w-2xl w-full max-h-[90vh] overflow-auto">
            <img src={slipPreviewUrl} alt="สลิป" className="w-full rounded-lg" />
            <p className="text-center text-gray-400 text-sm mt-3">คลิกเพื่อปิด</p>
          </div>
        </div>
      )}
    </div>
  );
}
