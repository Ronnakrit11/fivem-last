"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingBag, User, CheckCircle, XCircle, Search, Clock, Loader2, Phone, CreditCard, X, Download, FileSpreadsheet, Shield, Trash2 } from "lucide-react";
import * as XLSX from "xlsx";
import Link from "next/link";

interface GameItem {
  id: string;
  name: string;
  image: string;
  price: number;
  isCustomPrice: boolean;
}

interface OrderUser {
  id: string;
  name: string;
  email: string;
}

interface Order {
  id: string;
  gameItemId: string;
  gameItem: GameItem;
  userId: string;
  user: OrderUser;
  amount: number;
  status: string;
  buyerName: string;
  buyerPhone: string;
  buyerBankAccount: string;
  selectedPaymentMethod: string;
  slipImage: string | null;
  acceptedPurchasePolicy: boolean;
  createdAt: Date;
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updating, setUpdating] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const pageSize = 20;
  const [userRole, setUserRole] = useState<string>("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchOrders = (page: number = 1) => {
    setLoading(true);
    fetch(`/api/admin/game-item-orders?page=${page}&limit=${pageSize}`)
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
          setOrders(data.orders || []);
          if (data.pagination) {
            setCurrentPage(data.pagination.page);
            setTotalPages(data.pagination.totalPages);
            setTotalOrders(data.pagination.total);
          }
        }
      })
      .catch(err => {
        console.error("Error fetching orders:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders(1);
    // Fetch user role
    fetch("/api/user/info")
      .then(res => res.json())
      .then(data => {
        if (data.role) setUserRole(data.role);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteOrder = async (orderId: string) => {
    if (!confirm("คุณต้องการลบรายการนี้หรือไม่?")) return;
    
    setDeleting(orderId);
    try {
      const res = await fetch(`/api/admin/game-item-orders?id=${orderId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setOrders(orders.filter(o => o.id !== orderId));
        alert("ลบรายการสำเร็จ");
      } else {
        alert(data.error || "ไม่สามารถลบรายการได้");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("เกิดข้อผิดพลาด");
    } finally {
      setDeleting(null);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    setUpdating(orderId);
    try {
      const res = await fetch(`/api/admin/game-item-orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
        alert(`อัปเดตสถานะเป็น ${status === "APPROVED" ? "อนุมัติ" : status === "REJECTED" ? "ปฏิเสธ" : status} สำเร็จ`);
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
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            อนุมัติแล้ว
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            เสร็จสิ้น
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            รออนุมัติ
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      (order.user?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (order.user?.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (order.gameItem?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (order.buyerName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (order.buyerPhone?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (order.id?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: orders.length,
    approved: orders.filter(o => o.status === "APPROVED").length,
    completed: orders.filter(o => o.status === "COMPLETED").length,
    pending: orders.filter(o => o.status === "PENDING").length,
    rejected: orders.filter(o => o.status === "REJECTED").length,
    totalRevenue: orders.filter(o => o.status === "APPROVED" || o.status === "COMPLETED").reduce((sum, o) => sum + (o.amount || 0), 0),
  };

  const openDetail = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "APPROVED": return "อนุมัติแล้ว";
      case "COMPLETED": return "เสร็จสิ้น";
      case "PENDING": return "รออนุมัติ";
      case "REJECTED": return "ปฏิเสธ";
      default: return status;
    }
  };

  const exportToExcel = () => {
    const dataToExport = filteredOrders.map((order, index) => ({
      "ลำดับ": index + 1,
      "รหัสคำสั่งซื้อ": order.id,
      "สินค้า": order.gameItem?.name || "-",
      "ราคา (บาท)": order.amount || 0,
      "ชื่อผู้ซื้อ": order.buyerName || "-",
      "เบอร์โทร": order.buyerPhone || "-",
      "เลขบัญชีผู้โอน": order.buyerBankAccount || "-",
      "บัญชีผู้ใช้": order.user?.name || "-",
      "อีเมล": order.user?.email || "-",
      "สถานะ": getStatusText(order.status),
      "วันที่สั่งซื้อ": formatDate(order.createdAt),
      "มีสลิป": order.slipImage ? "มี" : "ไม่มี",
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    
    // Set column widths
    ws["!cols"] = [
      { wch: 6 },   // ลำดับ
      { wch: 30 },  // รหัสคำสั่งซื้อ
      { wch: 25 },  // สินค้า
      { wch: 12 },  // ราคา
      { wch: 20 },  // ชื่อผู้ซื้อ
      { wch: 15 },  // เบอร์โทร
      { wch: 20 },  // เลขบัญชี
      { wch: 20 },  // บัญชีผู้ใช้
      { wch: 25 },  // อีเมล
      { wch: 12 },  // สถานะ
      { wch: 20 },  // วันที่
      { wch: 8 },   // มีสลิป
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "คำสั่งซื้อ");
    
    const fileName = `orders_${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
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
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                <ShoppingBag className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  คำสั่งซื้อสินค้า
                </h1>
                <p className="text-gray-600">
                  คำสั่งซื้อทั้งหมดในระบบ ({filteredOrders.length} รายการ)
                </p>
              </div>
            </div>
            <button
              onClick={exportToExcel}
              disabled={loading || filteredOrders.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
            >
              <FileSpreadsheet className="w-5 h-5" />
              Export Excel
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">ทั้งหมด</p>
            <p className="text-2xl font-bold text-gray-900">
              {loading ? <span className="inline-block w-12 h-6 bg-gray-200 rounded animate-pulse" /> : stats.total}
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">รออนุมัติ</p>
            <p className="text-2xl font-bold text-yellow-600">
              {loading ? <span className="inline-block w-12 h-6 bg-gray-200 rounded animate-pulse" /> : stats.pending}
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">อนุมัติแล้ว</p>
            <p className="text-2xl font-bold text-blue-600">
              {loading ? <span className="inline-block w-12 h-6 bg-gray-200 rounded animate-pulse" /> : stats.approved}
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">เสร็จสิ้น</p>
            <p className="text-2xl font-bold text-green-600">
              {loading ? <span className="inline-block w-12 h-6 bg-gray-200 rounded animate-pulse" /> : stats.completed}
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">รายได้รวม</p>
            <p className="text-xl font-bold text-indigo-600">
              {loading ? <span className="inline-block w-16 h-6 bg-gray-200 rounded animate-pulse" /> : `฿${stats.totalRevenue.toFixed(0)}`}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="ค้นหา ชื่อผู้ซื้อ, เบอร์โทร, สินค้า..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">ทุกสถานะ</option>
                <option value="PENDING">รออนุมัติ</option>
                <option value="APPROVED">อนุมัติแล้ว</option>
                <option value="COMPLETED">เสร็จสิ้น</option>
                <option value="REJECTED">ปฏิเสธ</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3 mb-2" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
              </div>
            ))
          ) : filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div 
                key={order.id} 
                className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => openDetail(order)}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      {/* Product Image */}
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {order.gameItem?.image ? (
                          <img src={order.gameItem.image} alt={order.gameItem.name} className="w-full h-full object-cover" />
                        ) : (
                          <ShoppingBag className="w-6 h-6 text-orange-600" />
                        )}
                      </div>

                      {/* Order Info */}
                      <div>
                        <h3 className="font-semibold text-gray-900">{order.gameItem?.name || "สินค้า"}</h3>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">{order.buyerName || order.user?.name || "-"}</span>
                          {order.buyerPhone && <span className="ml-2 text-gray-400">• {order.buyerPhone}</span>}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">฿{order.amount?.toFixed(0) || 0}</p>
                      <div className="mt-1">{getStatusBadge(order.status)}</div>
                      {order.slipImage && (
                        <span className="inline-block mt-1 text-xs text-blue-600">มีสลิป</span>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions for Pending */}
                  {order.status === "PENDING" && (
                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateOrderStatus(order.id, "APPROVED");
                        }}
                        disabled={updating === order.id}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-1"
                      >
                        {updating === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        อนุมัติ
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateOrderStatus(order.id, "REJECTED");
                        }}
                        disabled={updating === order.id}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-1"
                      >
                        {updating === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                        ปฏิเสธ
                      </button>
                    </div>
                  )}
                  {/* Delete button - Owner only */}
                  {userRole === "owner" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteOrder(order.id);
                      }}
                      disabled={deleting === order.id}
                      className="mt-2 w-full px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 disabled:opacity-50 flex items-center justify-center gap-1"
                    >
                      {deleting === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      ลบรายการ
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-md p-12 border border-gray-200 text-center">
              <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">ไม่พบคำสั่งซื้อ</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between bg-white rounded-xl shadow-md p-4 border border-gray-200">
            <p className="text-sm text-gray-600">
              แสดง {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, totalOrders)} จาก {totalOrders} รายการ
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchOrders(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ก่อนหน้า
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => fetchOrders(pageNum)}
                      disabled={loading}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === pageNum
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      } disabled:opacity-50`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => fetchOrders(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ถัดไป
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">รายละเอียดคำสั่งซื้อ</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Order ID */}
              <div className="mb-4 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                <p className="text-xs text-indigo-600 mb-1">รหัสคำสั่งซื้อ</p>
                <p className="font-mono text-sm text-indigo-900 break-all">{selectedOrder.id}</p>
              </div>

              {/* Product */}
              <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center overflow-hidden">
                  {selectedOrder.gameItem?.image ? (
                    <img src={selectedOrder.gameItem.image} alt={selectedOrder.gameItem.name} className="w-full h-full object-cover" />
                  ) : (
                    <ShoppingBag className="w-6 h-6 text-orange-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedOrder.gameItem?.name}</h3>
                  <p className="text-2xl font-bold text-green-600">฿{selectedOrder.amount?.toFixed(0)}</p>
                </div>
              </div>

              {/* Buyer Info */}
              <div className="space-y-3 mb-6">
                <h4 className="font-semibold text-gray-700">ข้อมูลผู้ซื้อ</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">ชื่อ-นามสกุล</p>
                    <p className="font-medium text-gray-900">{selectedOrder.buyerName || "-"}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">เบอร์โทร</p>
                    <p className="font-medium text-gray-900">{selectedOrder.buyerPhone || "-"}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg col-span-2">
                    <p className="text-xs text-gray-500 mb-1">เลขบัญชีผู้โอน</p>
                    <p className="font-medium text-gray-900 font-mono">{selectedOrder.buyerBankAccount || "-"}</p>
                  </div>
                </div>
              </div>

              {/* Selected Payment Method */}
              {selectedOrder.selectedPaymentMethod && (
                <div className="space-y-3 mb-6">
                  <h4 className="font-semibold text-gray-700">วิธีการชำระเงินที่เลือก</h4>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="font-medium text-blue-800">🏦 {selectedOrder.selectedPaymentMethod}</p>
                  </div>
                </div>
              )}

              {/* User Account */}
              <div className="space-y-3 mb-6">
                <h4 className="font-semibold text-gray-700">บัญชีผู้ใช้</h4>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">{selectedOrder.user?.name || "-"}</p>
                  <p className="text-sm text-gray-500">{selectedOrder.user?.email || "-"}</p>
                </div>
              </div>

              {/* Slip Image */}
              {selectedOrder.slipImage && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-3">สลิปการโอนเงิน</h4>
                  <img 
                    src={selectedOrder.slipImage} 
                    alt="Slip" 
                    className="w-full rounded-lg border border-gray-200"
                  />
                </div>
              )}

              {/* Policy Acceptance */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-2">นโยบายการซื้อ</h4>
                <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${
                  selectedOrder.acceptedPurchasePolicy 
                    ? "bg-green-100 text-green-800" 
                    : "bg-gray-100 text-gray-600"
                }`}>
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {selectedOrder.acceptedPurchasePolicy ? "ยอมรับนโยบายแล้ว" : "ยังไม่ได้ยอมรับนโยบาย"}
                  </span>
                </div>
              </div>

              {/* Status */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-2">สถานะ</h4>
                {getStatusBadge(selectedOrder.status)}
                <p className="text-xs text-gray-500 mt-2">สั่งซื้อเมื่อ: {formatDate(selectedOrder.createdAt)}</p>
              </div>

              {/* Actions */}
              {selectedOrder.status === "PENDING" && (
                <div className="flex gap-3">
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, "APPROVED")}
                    disabled={updating === selectedOrder.id}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {updating === selectedOrder.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    อนุมัติ
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, "REJECTED")}
                    disabled={updating === selectedOrder.id}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {updating === selectedOrder.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                    ปฏิเสธ
                  </button>
                </div>
              )}
              {selectedOrder.status === "APPROVED" && (
                <button
                  onClick={() => updateOrderStatus(selectedOrder.id, "COMPLETED")}
                  disabled={updating === selectedOrder.id}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {updating === selectedOrder.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  ทำเครื่องหมายเสร็จสิ้น
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
