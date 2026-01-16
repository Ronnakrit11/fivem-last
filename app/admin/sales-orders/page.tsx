"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingBag, User, CheckCircle, XCircle, Search, Clock, Loader2 } from "lucide-react";
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
  note: string;
  createdAt: Date;
}

export default function SalesOrdersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
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
        alert(`อัปเดตสถานะเป็น ${status} สำเร็จ`);
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

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      (order.user?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (order.user?.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (order.gameItem?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (order.note?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (order.id?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: orders.length,
    approved: orders.filter(o => o.status === "APPROVED").length,
    completed: orders.filter(o => o.status === "COMPLETED").length,
    pending: orders.filter(o => o.status === "PENDING").length,
    rejected: orders.filter(o => o.status === "REJECTED").length,
    totalRevenue: orders.filter(o => o.status === "APPROVED" || o.status === "COMPLETED").reduce((sum, o) => sum + (o.amount || 0), 0),
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
                  จัดการคำสั่งขายสินค้า
                </h1>
                <p className="text-gray-600">
                  คำสั่งซื้อไอเทมเกมทั้งหมดในระบบ ({filteredOrders.length} รายการ)
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
              {loading ? <span className="inline-block w-16 h-6 bg-gray-200 rounded animate-pulse" /> : `฿${stats.totalRevenue.toFixed(2)}`}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="ค้นหา ชื่อผู้ใช้, อีเมล, เกม, Player ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Status Filter */}
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

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ผู้ซื้อ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    สินค้า
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ราคา
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    หมายเหตุ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    สถานะ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  // Loading skeletons
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-40" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-28" />
                      </td>
                    </tr>
                  ))
                ) : filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{order.user?.name || '-'}</div>
                            <div className="text-sm text-gray-500">{order.user?.email || '-'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {order.gameItem?.image && (
                            <img src={order.gameItem.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{order.gameItem?.name || '-'}</div>
                            <div className="text-xs text-gray-500">#{order.id?.slice(0, 8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-indigo-600">
                          ฿{(order.amount || 0).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">{formatDate(order.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-xs truncate">
                          {order.note || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.status === "PENDING" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateOrderStatus(order.id, "APPROVED")}
                              disabled={updating === order.id}
                              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 disabled:opacity-50 flex items-center gap-1"
                            >
                              {updating === order.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                              อนุมัติ
                            </button>
                            <button
                              onClick={() => updateOrderStatus(order.id, "REJECTED")}
                              disabled={updating === order.id}
                              className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200 disabled:opacity-50 flex items-center gap-1"
                            >
                              <XCircle className="w-3 h-3" />
                              ปฏิเสธ
                            </button>
                          </div>
                        )}
                        {order.status === "APPROVED" && (
                          <button
                            onClick={() => updateOrderStatus(order.id, "COMPLETED")}
                            disabled={updating === order.id}
                            className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200 disabled:opacity-50 flex items-center gap-1"
                          >
                            {updating === order.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                            เสร็จสิ้น
                          </button>
                        )}
                        {(order.status === "COMPLETED" || order.status === "REJECTED") && (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">ไม่พบคำสั่งซื้อ</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
