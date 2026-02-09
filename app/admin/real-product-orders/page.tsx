"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, CheckCircle, XCircle, Search, Clock, Loader2, X, Eye, Package } from "lucide-react";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  realProduct: {
    id: string;
    name: string;
    image: string;
  };
}

interface OrderUser {
  id: string;
  name: string;
  email: string;
}

interface RealProductOrder {
  id: string;
  userId: string;
  user: OrderUser;
  totalAmount: number;
  status: string;
  buyerName: string;
  buyerPhone: string;
  buyerAddress: string;
  buyerBankAccount: string;
  selectedPaymentMethod: string;
  slipImage: string | null;
  adminNote: string | null;
  createdAt: string;
  items: OrderItem[];
}

export default function AdminRealProductOrdersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<RealProductOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updating, setUpdating] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<RealProductOrder | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const pageSize = 20;

  const fetchOrders = (page: number = 1) => {
    setLoading(true);
    fetch(`/api/admin/real-product-orders?page=${page}&limit=${pageSize}`)
      .then(res => {
        if (res.status === 401) { router.push("/auth"); return null; }
        if (res.status === 403) { router.push("/dashboard"); return null; }
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
      .catch(err => console.error("Error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    if (!confirm(`คุณแน่ใจว่าต้องการ${status === "APPROVED" ? "อนุมัติ" : "ปฏิเสธ"}คำสั่งซื้อนี้?`)) return;

    setUpdating(orderId);
    try {
      const res = await fetch("/api/admin/real-product-orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(prev => prev ? { ...prev, status } : null);
        }
        alert(`${status === "APPROVED" ? "อนุมัติ" : "ปฏิเสธ"}คำสั่งซื้อสำเร็จ`);
      } else {
        alert(data.error || "เกิดข้อผิดพลาด");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("เกิดข้อผิดพลาด");
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3" />รอดำเนินการ</span>;
      case "APPROVED":
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3" />อนุมัติแล้ว</span>;
      case "REJECTED":
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3" />ปฏิเสธ</span>;
      case "COMPLETED":
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><CheckCircle className="w-3 h-3" />เสร็จสิ้น</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("th-TH", { timeZone: "Asia/Bangkok" });
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === "" ||
      order.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            กลับไปหน้าจัดการ
          </Link>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mr-4">
              <ShoppingBag className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">คำสั่งซื้อสินค้าจริง</h1>
              <p className="text-gray-600">ดูและจัดการคำสั่งซื้อสินค้าจริงทั้งหมด ({totalOrders} รายการ)</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหาชื่อ, อีเมล, หมายเลขคำสั่งซื้อ..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            >
              <option value="all">ทั้งหมด</option>
              <option value="PENDING">รอดำเนินการ</option>
              <option value="APPROVED">อนุมัติแล้ว</option>
              <option value="REJECTED">ปฏิเสธ</option>
              <option value="COMPLETED">เสร็จสิ้น</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-rose-500 mb-2" />
              <p className="text-gray-500">กำลังโหลด...</p>
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">คำสั่งซื้อ</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ผู้สั่ง</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">รายการ</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ยอดรวม</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">สถานะ</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">วันที่</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="text-xs text-gray-500 font-mono">{order.id.slice(0, 12)}...</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900">{order.buyerName || order.user?.name || "-"}</p>
                        <p className="text-xs text-gray-500">{order.buyerPhone || "-"}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-700">{order.items.length} รายการ</p>
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {order.items.map(i => i.realProduct.name).join(", ")}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-bold text-green-600">฿{order.totalAmount.toFixed(2)}</p>
                      </td>
                      <td className="px-4 py-3">{getStatusBadge(order.status)}</td>
                      <td className="px-4 py-3">
                        <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => { setSelectedOrder(order); setShowDetailModal(true); }}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            title="ดูรายละเอียด"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {order.status === "PENDING" && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(order.id, "APPROVED")}
                                disabled={updating === order.id}
                                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
                                title="อนุมัติ"
                              >
                                {updating === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(order.id, "REJECTED")}
                                disabled={updating === order.id}
                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                                title="ปฏิเสธ"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">ยังไม่มีคำสั่งซื้อ</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-500">หน้า {currentPage} จาก {totalPages}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchOrders(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
                >
                  ก่อนหน้า
                </button>
                <button
                  onClick={() => fetchOrders(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
                >
                  ถัดไป
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">รายละเอียดคำสั่งซื้อ</h2>
                  <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Order Items */}
                <div className="space-y-3 mb-6">
                  <h4 className="font-semibold text-gray-700">รายการสินค้า</h4>
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                        {item.realProduct.image ? (
                          <img src={item.realProduct.image} alt={item.realProduct.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.realProduct.name}</p>
                        <p className="text-sm text-gray-500">x{item.quantity} • ฿{item.price.toFixed(2)}</p>
                      </div>
                      <p className="font-bold text-green-600">฿{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  <div className="flex justify-between items-center p-3 bg-rose-50 rounded-lg border border-rose-200">
                    <span className="font-semibold text-gray-700">ยอดรวม</span>
                    <span className="text-xl font-bold text-rose-600">฿{selectedOrder.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Buyer Info */}
                <div className="space-y-3 mb-6">
                  <h4 className="font-semibold text-gray-700">ข้อมูลผู้สั่ง</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">ชื่อ-นามสกุล</p>
                      <p className="font-medium text-gray-900">{selectedOrder.buyerName || "-"}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">เบอร์โทร</p>
                      <p className="font-medium text-gray-900">{selectedOrder.buyerPhone || "-"}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg col-span-2">
                      <p className="text-xs text-gray-500">ที่อยู่จัดส่ง</p>
                      <p className="font-medium text-gray-900">{selectedOrder.buyerAddress || "-"}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">เลขบัญชีผู้โอน</p>
                      <p className="font-medium text-gray-900">{selectedOrder.buyerBankAccount || "-"}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">บัญชีผู้ใช้</p>
                      <p className="font-medium text-gray-900">{selectedOrder.user?.name || "-"}</p>
                      <p className="text-xs text-gray-500">{selectedOrder.user?.email || "-"}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                {selectedOrder.selectedPaymentMethod && (
                  <div className="space-y-3 mb-6">
                    <h4 className="font-semibold text-gray-700">วิธีการชำระเงิน</h4>
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="font-medium text-blue-800">🏦 {selectedOrder.selectedPaymentMethod}</p>
                    </div>
                  </div>
                )}

                {/* Slip Image */}
                {selectedOrder.slipImage && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-700 mb-3">สลิปการโอนเงิน</h4>
                    <img src={selectedOrder.slipImage} alt="Slip" className="w-full rounded-lg border border-gray-200" />
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
                      onClick={() => handleUpdateStatus(selectedOrder.id, "APPROVED")}
                      disabled={updating === selectedOrder.id}
                      className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {updating === selectedOrder.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                      อนุมัติ
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, "REJECTED")}
                      disabled={updating === selectedOrder.id}
                      className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      ปฏิเสธ
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
