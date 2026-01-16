"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DollarSign, TrendingUp, Receipt, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";

interface Transaction {
  id: string;
  transRef: string;
  amount: number;
  userId: string;
  userName: string;
  userEmail: string;
  verifiedAt: string;
}

interface TransactionsData {
  transactions: Transaction[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
  stats: {
    totalAmount: number;
    totalTransactions: number;
  };
}

export default function TransactionsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TransactionsData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage]);

  const fetchTransactions = async (page: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/transactions?page=${page}&limit=20`);
      if (res.status === 401) {
        router.push("/auth");
        return;
      }
      if (res.status === 403) {
        router.push("/dashboard");
        return;
      }
      const jsonData = await res.json();
      setData(jsonData);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          {/* Back Button */}
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">กลับไปหน้าจัดการ</span>
          </Link>

          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                ประวัติการเติมเงิน
              </h1>
              <p className="text-gray-600">รายการเติมเงินของลูกค้าทั้งหมด</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">ยอดเติมเงินทั้งหมด</p>
                  <p className="text-3xl font-bold text-green-600">
                    ฿{data.stats.totalAmount.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="w-10 h-10 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">จำนวนครั้งทั้งหมด</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {data.stats.totalTransactions.toLocaleString()}
                  </p>
                </div>
                <Receipt className="w-10 h-10 text-purple-600" />
              </div>
            </div>
          </div>
        )}

        {/* Transactions Table */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">รายการเติมเงิน</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600 mt-4">กำลังโหลดข้อมูล...</p>
            </div>
          ) : data && data.transactions.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        วันที่/เวลา
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ชื่อผู้ใช้
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        อีเมล
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ref
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        จำนวนเงิน
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(transaction.verifiedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.userName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {transaction.userEmail}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                          {transaction.transRef}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-green-600">
                          ฿{transaction.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  แสดง {((data.pagination.page - 1) * data.pagination.limit) + 1} - {Math.min(data.pagination.page * data.pagination.limit, data.pagination.totalCount)} จาก {data.pagination.totalCount} รายการ
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    ก่อนหน้า
                  </button>
                  <div className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium">
                    {currentPage} / {data.pagination.totalPages}
                  </div>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(data.pagination.totalPages, prev + 1))}
                    disabled={currentPage === data.pagination.totalPages}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    ถัดไป
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">ยังไม่มีรายการเติมเงิน</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
