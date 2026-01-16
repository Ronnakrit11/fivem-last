"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingBag, User, CheckCircle, XCircle, Search, Clock, Loader2, Phone, CreditCard, X } from "lucide-react";
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
  slipImage: string | null;
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

  const fetchOrders = () => {
    fetch("/api/admin/game-item-orders")
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
    fetchOrders();
  }, [router]);

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
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">รายละเอียดคำสั่งซื้อ</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
