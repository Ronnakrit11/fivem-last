"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Users, Search, CheckCircle, AlertCircle, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  purchaseCount: number;
  totalSpent: number;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    fetch(`/api/admin/users?page=${currentPage}&limit=${itemsPerPage}`)
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
          setUsers(data.users || []);
          setPagination(data.pagination || null);
        }
      })
      .catch(err => {
        console.error("Error fetching users:", err);
        showNotification("error", "เกิดข้อผิดพลาดในการโหลดข้อมูล");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUpdateRole = async (user: User) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    const confirmMessage = user.role === "admin"
      ? `คุณต้องการเปลี่ยน ${user.name} จาก Admin เป็น User ใช่หรือไม่?`
      : `คุณต้องการเปลี่ยน ${user.name} จาก User เป็น Admin ใช่หรือไม่?`;

    if (!confirm(confirmMessage)) {
      return;
    }

    setUpdatingRole(user.id);
    try {
      const response = await fetch("/api/admin/update-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          newRole: newRole,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showNotification("success", "อัปเดตสิทธิ์สำเร็จ");
        fetchUsers();
      } else {
        showNotification("error", data.error || "เกิดข้อผิดพลาด");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      showNotification("error", "เกิดข้อผิดพลาดในการอัปเดต");
    } finally {
      setUpdatingRole(null);
    }
  };

  // Filter users on current page only (client-side filtering)
  const filteredUsers = users.filter(user =>
    searchTerm === "" || 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.includes(searchTerm)
  );

  const getRoleBadge = (role: string) => {
    if (role === "admin") {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
          Admin
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
        User
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Notification */}
        {notification && (
          <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top">
            <div className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
              notification.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}>
              {notification.type === "success" ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span>{notification.message}</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            กลับหน้าหลัก
          </Link>

          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                จัดการผู้ใช้
              </h1>
              <p className="text-gray-600">
                ดูและแก้ไขข้อมูลผู้ใช้ในระบบ
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="ค้นหาด้วยชื่อ, อีเมล หรือ ID (ในหน้าปัจจุบัน)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {searchTerm && (
            <p className="mt-2 text-sm text-gray-500">
              💡 กำลังค้นหาในหน้าปัจจุบันเท่านั้น (หน้า {currentPage})
            </p>
          )}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <p className="text-sm text-gray-600">ผู้ใช้ทั้งหมด</p>
            <p className="text-2xl font-bold text-gray-900">{pagination?.total || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <p className="text-sm text-gray-600">ซื้อทั้งหมดในหน้านี้</p>
            <p className="text-2xl font-bold text-green-600">
              {users.reduce((sum, u) => sum + u.purchaseCount, 0)} ครั้ง
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <p className="text-sm text-gray-600">ยอดซื้อในหน้านี้</p>
            <p className="text-2xl font-bold text-blue-600">
              ฿{users.reduce((sum, u) => sum + u.totalSpent, 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ผู้ใช้
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      บทบาท
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ซื้อทั้งหมด
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ยอดซื้อรวม
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      วันที่สมัคร
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      การจัดการ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            ID: {user.id}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {user.purchaseCount} ครั้ง
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-blue-600">
                          ฿{user.totalSpent.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString("th-TH")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleUpdateRole(user)}
                            disabled={updatingRole === user.id}
                            className={`inline-flex items-center px-3 py-1 rounded-lg transition-colors text-sm ${
                              user.role === "admin"
                                ? "bg-orange-500 text-white hover:bg-orange-600"
                                : "bg-purple-500 text-white hover:bg-purple-600"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {updatingRole === user.id ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                            ) : (
                              <Shield className="w-4 h-4 mr-1" />
                            )}
                            {user.role === "admin" ? "ลดเป็น User" : "เลื่อนเป็น Admin"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">ไม่พบผู้ใช้</p>
          </div>
        )}

        {/* Pagination Controls */}
        {pagination && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                แสดง {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, pagination.total)} จาก {pagination.total} ผู้ใช้
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              {/* Items per page selector */}
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={5}>5 / หน้า</option>
                <option value={10}>10 / หน้า</option>
                <option value={20}>20 / หน้า</option>
                <option value={50}>50 / หน้า</option>
              </select>

              {/* Page navigation */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="hidden sm:inline-flex px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    หน้าแรก
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                <div className="flex items-center gap-1 mx-2">
                  {(() => {
                    const pages = [];
                    const showPages = 5;
                    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
                    const endPage = Math.min(pagination.totalPages, startPage + showPages - 1);

                    if (endPage - startPage + 1 < showPages) {
                      startPage = Math.max(1, endPage - showPages + 1);
                    }

                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === i
                              ? "bg-blue-500 text-white"
                              : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {i}
                        </button>
                      );
                    }
                    return pages;
                  })()}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                  disabled={currentPage === pagination.totalPages}
                  className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentPage(pagination.totalPages)}
                  disabled={currentPage === pagination.totalPages}
                  className="hidden sm:inline-flex px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  หน้าสุดท้าย
                </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
