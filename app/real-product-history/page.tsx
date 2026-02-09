"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Clock, CheckCircle, XCircle, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";

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

interface RealProductOrder {
  id: string;
  totalAmount: number;
  status: string;
  buyerName: string;
  buyerPhone: string;
  buyerAddress: string;
  selectedPaymentMethod: string;
  adminNote: string | null;
  createdAt: string;
  items: OrderItem[];
}

export default function RealProductHistoryPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<RealProductOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<RealProductOrder | null>(null);

  useEffect(() => {
    fetch("/api/real-product-orders")
      .then(res => {
        if (res.status === 401) { router.push("/auth"); return null; }
        return res.json();
      })
      .then(data => {
        if (data) setOrders(data.orders || []);
      })
      .catch(err => console.error("Error:", err))
      .finally(() => setLoading(false));
  }, [router]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"><Clock className="w-3 h-3" />รอดำเนินการ</span>;
      case "APPROVED":
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30"><CheckCircle className="w-3 h-3" />อนุมัติแล้ว</span>;
      case "REJECTED":
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30"><XCircle className="w-3 h-3" />ปฏิเสธ</span>;
      case "COMPLETED":
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30"><CheckCircle className="w-3 h-3" />เสร็จสิ้น</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-300">{status}</span>;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("th-TH", { timeZone: "Asia/Bangkok" });
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 [background:radial-gradient(600px_400px_at_50%_0%,rgba(244,63,94,0.2),transparent_60%),radial-gradient(520px_360px_at_50%_100%,rgba(236,72,153,0.2),transparent_60%)] opacity-50"></div>
        <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)];background-size:24px_24px,24px_24px;background-position:-1px_-1px; opacity-10"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            กลับหน้าหลัก
          </Link>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 mb-4">
            <ShoppingBag className="w-8 h-8 text-rose-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">ประวัติการซื้อสินค้าจริง</h1>
          <p className="text-gray-400">ดูสถานะคำสั่งซื้อสินค้าจริงทั้งหมดของคุณ</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="rounded-2xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">ทั้งหมด</p>
                <p className="text-2xl font-bold text-white">{loading ? "..." : orders.length}</p>
              </div>
              <ShoppingBag className="w-10 h-10 text-rose-400" />
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">รอดำเนินการ</p>
                <p className="text-2xl font-bold text-yellow-400">{loading ? "..." : orders.filter(o => o.status === "PENDING").length}</p>
              </div>
              <Clock className="w-10 h-10 text-yellow-400" />
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">อนุมัติแล้ว</p>
                <p className="text-2xl font-bold text-green-400">{loading ? "..." : orders.filter(o => o.status === "APPROVED" || o.status === "COMPLETED").length}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">ยอดรวมทั้งหมด</p>
                <p className="text-2xl font-bold text-rose-400">฿{loading ? "..." : orders.reduce((sum, o) => sum + o.totalAmount, 0).toFixed(0)}</p>
              </div>
              <Package className="w-10 h-10 text-rose-400" />
            </div>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
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
                    <div className="h-8 bg-white/10 rounded w-20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                className="rounded-2xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl cursor-pointer hover:bg-white/15 transition-all"
              >
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getStatusBadge(order.status)}
                      <span className="text-xs text-gray-500 font-mono">#{order.id.slice(0, 8)}</span>
                    </div>
                    <span className="text-lg font-bold text-rose-400">฿{order.totalAmount.toFixed(0)}</span>
                  </div>

                  {/* Items preview */}
                  <div className="flex items-center gap-2 mb-2">
                    {order.items.slice(0, 4).map((item) => (
                      <div key={item.id} className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                        {item.realProduct.image ? (
                          <img src={item.realProduct.image} alt={item.realProduct.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-5 h-5 text-gray-500" />
                          </div>
                        )}
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <span className="text-xs text-gray-400">+{order.items.length - 4} รายการ</span>
                    )}
                    <span className="text-sm text-gray-400 ml-auto">{order.items.length} รายการ</span>
                  </div>

                  <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>

                  {/* Expanded Details */}
                  {selectedOrder?.id === order.id && (
                    <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                      {/* Items */}
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-2">รายการสินค้า</h4>
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 py-2">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                              {item.realProduct.image ? (
                                <img src={item.realProduct.image} alt={item.realProduct.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-5 h-5 text-gray-500" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-white">{item.realProduct.name}</p>
                              <p className="text-xs text-gray-400">x{item.quantity} • ฿{item.price.toFixed(0)}</p>
                            </div>
                            <p className="text-sm font-bold text-green-400">฿{(item.price * item.quantity).toFixed(0)}</p>
                          </div>
                        ))}
                      </div>

                      {/* Buyer Info */}
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="p-2 bg-white/5 rounded-lg">
                          <p className="text-xs text-gray-500">ชื่อ</p>
                          <p className="text-white">{order.buyerName || "-"}</p>
                        </div>
                        <div className="p-2 bg-white/5 rounded-lg">
                          <p className="text-xs text-gray-500">เบอร์โทร</p>
                          <p className="text-white">{order.buyerPhone || "-"}</p>
                        </div>
                        <div className="p-2 bg-white/5 rounded-lg col-span-2">
                          <p className="text-xs text-gray-500">ที่อยู่จัดส่ง</p>
                          <p className="text-white">{order.buyerAddress || "-"}</p>
                        </div>
                        {order.selectedPaymentMethod && (
                          <div className="p-2 bg-white/5 rounded-lg col-span-2">
                            <p className="text-xs text-gray-500">วิธีชำระเงิน</p>
                            <p className="text-white">{order.selectedPaymentMethod}</p>
                          </div>
                        )}
                      </div>

                      {/* Admin Note */}
                      {order.adminNote && (
                        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                          <p className="text-xs text-blue-400 mb-1">หมายเหตุจากแอดมิน</p>
                          <p className="text-sm text-white">{order.adminNote}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl p-8 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">ยังไม่มีประวัติการซื้อ</h2>
            <p className="text-gray-400 mb-4">คุณยังไม่ได้สั่งซื้อสินค้าจริง</p>
            <Link href="/" className="inline-flex items-center px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium">
              <Package className="w-4 h-4 mr-2" />
              ดูสินค้า
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
