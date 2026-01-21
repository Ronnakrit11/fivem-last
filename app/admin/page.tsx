"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Settings, Users, Activity, FileText, Gamepad2, Building2, MessageCircle, Shield } from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSales: 0,
    todayOrders: 0,
    totalOrders: 0,
  });

  useEffect(() => {
    fetch("/api/admin/stats")
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
          setStats({
            totalUsers: data.totalUsers || 0,
            totalSales: data.totalSales || 0,
            todayOrders: data.todayOrders || 0,
            totalOrders: data.totalOrders || 0,
          });
        }
      })
      .catch(err => {
        console.error("Error fetching stats:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
              <Settings className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                จัดการหลังบ้าน
              </h1>
              <p className="text-gray-600">ระบบจัดการสำหรับผู้ดูแลระบบ</p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">ผู้ใช้ทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? (
                    <span className="inline-block w-16 h-8 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    stats.totalUsers
                  )}
                </p>
              </div>
              <Users className="w-10 h-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">ยอดขายทั้งหมด</p>
                <p className="text-2xl font-bold text-green-600">
                  {loading ? (
                    <span className="inline-block w-24 h-8 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    `฿${stats.totalSales.toFixed(2)}`
                  )}
                </p>
              </div>
              <Activity className="w-10 h-10 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">คำสั่งซื้อวันนี้</p>
                <p className="text-2xl font-bold text-orange-600">
                  {loading ? (
                    <span className="inline-block w-12 h-8 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    stats.todayOrders
                  )}
                </p>
              </div>
              <Activity className="w-10 h-10 text-orange-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">ยอดขายทั้งหมด</p>
                <p className="text-2xl font-bold text-purple-600">
                  {loading ? (
                    <span className="inline-block w-12 h-8 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    stats.totalOrders
                  )}
                </p>
              </div>
              <Activity className="w-10 h-10 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Admin Menu */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin/users"
            className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                จัดการผู้ใช้
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              ดู แก้ไข และจัดการข้อมูลผู้ใช้ทั้งหมด
            </p>
          </Link>

          <Link
            href="/admin/game-items"
            className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                <Gamepad2 className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                จัดการสินค้าไอเทมเกม
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              จัดการเกม, Packages และการเรียงลำดับ
            </p>
          </Link>

          <Link
            href="/admin/orders"
            className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                คำสั่งซื้อสินค้า
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              ดูและจัดการคำสั่งซื้อสินค้าทั้งหมด
            </p>
          </Link>

          <Link
            href="/admin/auction"
            className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
                <Activity className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                จัดการการประมูล
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              ดูรายการประมูลและอนุมัติผู้ชนะ
            </p>
          </Link>

          <Link
            href="/admin/user-sells"
            className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                รายการ User ขาย
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              ดูสินค้าที่ผู้ใช้ต้องการขายให้เรา
            </p>
          </Link>

          <Link
            href="/admin/articles"
            className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mr-4">
                <FileText className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">
                บทความ
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              จัดการบทความและเนื้อหา SEO
            </p>
          </Link>

     

       

          <Link
            href="/admin/website-settings"
            className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mr-4">
                <Settings className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">
                ตั้งค่าเว็บไซต์
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              จัดการข้อมูลเว็บไซต์ โลโก้ และการตั้งค่าทั่วไป
            </p>
          </Link>

          <Link
            href="/admin/bank-settings"
            className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
                <Building2 className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                ตั้งค่าบัญชีธนาคาร
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              จัดการบัญชีธนาคารสำหรับรับชำระเงิน
            </p>
          </Link>

          <Link
            href="/admin/contact-buttons"
            className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <MessageCircle className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                จัดการปุ่มติดต่อ
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              ตั้งค่าปุ่มติดต่อ ลิงก์ รูปภาพ และ QR Code
            </p>
          </Link>

          <Link
            href="/admin/policy"
            className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                <Shield className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                จัดการนโยบาย
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              ตั้งค่านโยบายที่แสดงตอนสมัครสมาชิก
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
