"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, ArrowLeft, DollarSign, Box } from "lucide-react";
import Link from "next/link";
import ProductsTable from "./products-table";

interface Product {
  id: number;
  name: string;
  price: number;
  pricevip: number;
  agent_price: number;
  stock: number;
  img: string;
  des: string;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredIds, setFeaturedIds] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;

    // Check auth and fetch data in parallel
    Promise.all([
      fetch("/api/user/role").then(res => res.json()),
      fetch("/api/products").then(res => res.json()),
      fetch("/api/admin/featured").then(res => res.json()),
    ])
      .then(([roleData, productsData, featuredData]) => {
        if (!mounted) return;

        // Check if unauthorized
        if (roleData.error || roleData.role !== "admin") {
          router.push(roleData.role ? "/dashboard" : "/auth");
          return;
        }

        // Set data
        setProducts(productsData.data || []);
        setFeaturedIds(featuredData.featuredIds || []);
        setLoading(false);
      })
      .catch(err => {
        if (!mounted) return;
        console.error("Error fetching data:", err);
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [router]);

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
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  จัดการสินค้า
                </h1>
                <p className="text-gray-600">
                  สินค้าแอพพรีเมี่ยมทั้งหมด ({products.length} รายการ)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">สินค้าทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? <span className="inline-block w-12 h-8 bg-gray-200 rounded animate-pulse" /> : products.length}
                </p>
              </div>
              <Package className="w-10 h-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">คงเหลือ</p>
                <p className="text-2xl font-bold text-green-600">
                  {loading ? <span className="inline-block w-12 h-8 bg-gray-200 rounded animate-pulse" /> : products.filter(p => p.stock > 0).length}
                </p>
              </div>
              <Box className="w-10 h-10 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">หมดสต็อก</p>
                <p className="text-2xl font-bold text-red-600">
                  {loading ? <span className="inline-block w-12 h-8 bg-gray-200 rounded animate-pulse" /> : products.filter(p => p.stock === 0).length}
                </p>
              </div>
              <Box className="w-10 h-10 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">ราคาเฉลี่ย</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {loading ? <span className="inline-block w-16 h-8 bg-gray-200 rounded animate-pulse" /> : `฿${products.length > 0 ? (products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(0) : 0}`}
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Products Table */}
        <ProductsTable products={products} featuredIds={Array.from(featuredIds)} />
      </div>
    </div>
  );
}
