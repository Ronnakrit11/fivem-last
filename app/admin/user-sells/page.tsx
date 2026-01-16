"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingBag, User, CheckCircle, XCircle, Clock, Loader2, X, FolderOpen } from "lucide-react";
import Link from "next/link";

interface SellItem {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  catalog: {
    id: string;
    name: string;
    icon: string;
  } | null;
  name: string;
  description: string;
  price: number;
  image: string | null;
  status: string;
  adminNote: string | null;
  createdAt: Date;
}

interface Catalog {
  id: string;
  name: string;
  icon: string;
}

export default function UserSellsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sellItems, setSellItems] = useState<SellItem[]>([]);
  const [updating, setUpdating] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<SellItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCatalog, setSelectedCatalog] = useState<string>("all");
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);

  const fetchSellItems = () => {
    fetch("/api/admin/user-sells")
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
          setSellItems(data.sellItems || []);
          // Extract unique catalogs from sell items
          const uniqueCatalogs: Catalog[] = [];
          const catalogIds = new Set<string>();
          data.sellItems?.forEach((item: SellItem) => {
            if (item.catalog && !catalogIds.has(item.catalog.id)) {
              catalogIds.add(item.catalog.id);
              uniqueCatalogs.push(item.catalog);
            }
          });
          setCatalogs(uniqueCatalogs);
        }
      })
      .catch(err => {
        console.error("Error fetching sell items:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSellItems();
  }, [router]);

  // Filter items by selected catalog
  const filteredItems = sellItems.filter(item => {
    if (selectedCatalog === "all") return true;
    if (selectedCatalog === "uncategorized") return !item.catalog;
    return item.catalog?.id === selectedCatalog;
  });

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/user-sells/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setSellItems(prev => prev.map(item => item.id === id ? { ...item, status } : item));
        alert(`อัปเดตสถานะเป็น ${status === "APPROVED" ? "อนุมัติ" : "ปฏิเสธ"} สำเร็จ`);
        if (showDetailModal) {
          setShowDetailModal(false);
        }
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
      case "APPROVED":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            อนุมัติแล้ว
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            รอตรวจสอบ
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            ปฏิเสธ
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
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
    total: filteredItems.length,
    pending: filteredItems.filter(i => i.status === "PENDING").length,
    approved: filteredItems.filter(i => i.status === "APPROVED").length,
    rejected: filteredItems.filter(i => i.status === "REJECTED").length,
  };

  const uncategorizedCount = sellItems.filter(i => !i.catalog).length;

  const openDetail = (item: SellItem) => {
    setSelectedItem(item);
    setShowDetailModal(true);
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
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <ShoppingBag className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  รายการ User ขาย
                </h1>
                <p className="text-gray-600">
                  สินค้าที่ผู้ใช้ต้องการขายให้เรา ({filteredItems.length} รายการ)
                </p>
              </div>
            </div>
            <Link
              href="/admin/sell-catalogs"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 flex items-center gap-2"
            >
              <FolderOpen className="w-5 h-5" />
              จัดการหมวดหมู่
            </Link>
          </div>
        </div>

        {/* Catalog Filter Tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            <button
              onClick={() => setSelectedCatalog("all")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                selectedCatalog === "all"
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              ทั้งหมด ({sellItems.length})
            </button>
            {catalogs.map((cat) => {
              const count = sellItems.filter(i => i.catalog?.id === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCatalog(cat.id)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    selectedCatalog === cat.id
                      ? "bg-purple-600 text-white"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {cat.icon ? `${cat.icon} ` : ""}{cat.name} ({count})
                </button>
              );
            })}
            {uncategorizedCount > 0 && (
              <button
                onClick={() => setSelectedCatalog("uncategorized")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  selectedCatalog === "uncategorized"
                    ? "bg-gray-600 text-white"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                ไม่มีหมวดหมู่ ({uncategorizedCount})
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">ทั้งหมด</p>
            <p className="text-2xl font-bold text-gray-900">
              {loading ? <span className="inline-block w-12 h-6 bg-gray-200 rounded animate-pulse" /> : stats.total}
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">รอตรวจสอบ</p>
            <p className="text-2xl font-bold text-yellow-600">
              {loading ? <span className="inline-block w-12 h-6 bg-gray-200 rounded animate-pulse" /> : stats.pending}
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">อนุมัติแล้ว</p>
            <p className="text-2xl font-bold text-green-600">
              {loading ? <span className="inline-block w-12 h-6 bg-gray-200 rounded animate-pulse" /> : stats.approved}
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">ปฏิเสธ</p>
            <p className="text-2xl font-bold text-red-600">
              {loading ? <span className="inline-block w-12 h-6 bg-gray-200 rounded animate-pulse" /> : stats.rejected}
            </p>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-4">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3 mb-2" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
              </div>
            ))
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => openDetail(item)}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      {/* Product Image */}
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <ShoppingBag className="w-6 h-6 text-green-600" />
                        )}
                      </div>

                      {/* Item Info */}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          {item.catalog && (
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                              {item.catalog.icon ? `${item.catalog.icon} ` : ""}{item.catalog.name}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">{item.user?.name || "-"}</span>
                          <span className="ml-2 text-gray-400">• {item.user?.email}</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{formatDate(item.createdAt)}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">฿{item.price?.toFixed(0) || 0}</p>
                      <div className="mt-1">{getStatusBadge(item.status)}</div>
                    </div>
                  </div>

                  {/* Quick Actions for Pending */}
                  {item.status === "PENDING" && (
                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus(item.id, "APPROVED");
                        }}
                        disabled={updating === item.id}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-1"
                      >
                        {updating === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        อนุมัติ
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus(item.id, "REJECTED");
                        }}
                        disabled={updating === item.id}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-1"
                      >
                        {updating === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                        ปฏิเสธ
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-md p-12 border border-gray-200 text-center">
              <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">ยังไม่มีรายการขายจาก User</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">รายละเอียดสินค้า</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Product Image */}
              {selectedItem.image && (
                <div className="mb-6">
                  <img 
                    src={selectedItem.image} 
                    alt={selectedItem.name} 
                    className="w-full rounded-lg border border-gray-200"
                  />
                </div>
              )}

              {/* Product Info */}
              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedItem.name}</h3>
                  <p className="text-2xl font-bold text-green-600">฿{selectedItem.price?.toFixed(0)}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">รายละเอียด</p>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedItem.description}</p>
                </div>
              </div>

              {/* Seller Info */}
              <div className="space-y-3 mb-6">
                <h4 className="font-semibold text-gray-700">ข้อมูลผู้ขาย</h4>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">{selectedItem.user?.name || "-"}</p>
                  <p className="text-sm text-gray-500">{selectedItem.user?.email || "-"}</p>
                </div>
              </div>

              {/* Status */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-2">สถานะ</h4>
                {getStatusBadge(selectedItem.status)}
                <p className="text-xs text-gray-500 mt-2">ส่งเมื่อ: {formatDate(selectedItem.createdAt)}</p>
              </div>

              {/* Actions */}
              {selectedItem.status === "PENDING" && (
                <div className="flex gap-3">
                  <button
                    onClick={() => updateStatus(selectedItem.id, "APPROVED")}
                    disabled={updating === selectedItem.id}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {updating === selectedItem.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    อนุมัติ
                  </button>
                  <button
                    onClick={() => updateStatus(selectedItem.id, "REJECTED")}
                    disabled={updating === selectedItem.id}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {updating === selectedItem.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                    ปฏิเสธ
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
