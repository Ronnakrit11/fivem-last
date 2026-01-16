"use client";
import Link from "next/link";
import Image from "next/image";
import { Crown, ShoppingCart, X, CheckCircle, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  img: string;
  des: string;
}

export default function HomeProducts({ products }: { products: Product[] }) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [purchaseResult, setPurchaseResult] = useState<{
    success: boolean;
    message: string;
    data?: { reference: string };
  } | null>(null);

  // Check login status on client side
  useEffect(() => {
    fetch("/api/auth/get-session", {
      method: "GET",
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setIsLoggedIn(!!data.session || !!data.user))
      .catch(() => setIsLoggedIn(false));
  }, []);

  const handleBuyClick = (product: Product) => {
    if (!isLoggedIn) {
      if (confirm(`คุณต้องเข้าสู่ระบบก่อนซื้อ "${product.name}"\n\nต้องการไปหน้า Login หรือไม่?`)) {
        window.location.href = "/auth";
      }
    } else {
      setSelectedProduct(product);
      setShowModal(true);
      setPurchaseResult(null);
    }
  };

  const confirmPurchase = async () => {
    if (!selectedProduct) return;

    setLoading(true);
    try {
      const response = await fetch("/api/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          price: selectedProduct.price,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setPurchaseResult({
          success: true,
          message: "ซื้อสินค้าสำเร็จ! กำลังพาไปดูประวัติ...",
          data: data.data,
        });
        setTimeout(() => {
          router.push("/app-history");
        }, 1500);
      } else {
        setPurchaseResult({
          success: false,
          message: data.error || "เกิดข้อผิดพลาด",
        });
      }
    } catch {
      setPurchaseResult({
        success: false,
        message: "เกิดข้อผิดพลาดในการซื้อสินค้า",
      });
    } finally {
      setLoading(false);
    }
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">ไม่พบสินค้า</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-lg overflow-hidden flex flex-col transition-all bg-slate-900/80 shadow-md hover:shadow-lg hover:scale-[1.02]"
          >
            {/* Product Image */}
            <div className="relative aspect-square">
              <Image
                src={product.img}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 14vw"
                className="object-cover"
                loading="lazy"
                quality={75}
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.jp/300x200.png";
                }}
              />
              {/* Stock badge - top left */}
              {product.stock > 0 ? (
                <div className="absolute top-1 left-1 bg-purple-600 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                  คงเหลือ {product.stock}
                </div>
              ) : (
                <div className="absolute top-1 right-1 bg-red-500 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                  สินค้าหมด
                </div>
              )}
              {/* APP PREMIUM label */}
              <div className="absolute bottom-0 left-0 right-0 bg-purple-600 text-white text-[10px] font-bold text-center py-1">
                APP PREMIUM
              </div>
            </div>

            {/* Product Info */}
            <div className="p-2 flex flex-col flex-grow">
              <h3 className="text-sm font-bold text-white mb-1 line-clamp-2 min-h-[2.5rem]">
                {product.name}
              </h3>

              {/* Pricing */}
              <div className="mb-2 mt-auto">
                <div className="flex items-baseline justify-between">
                  <span className="text-[10px] text-gray-400">ราคา:</span>
                  <span className="text-base font-bold text-green-400">
                    ฿{product.price}
                  </span>
                </div>
              </div>

              {/* Buy Button */}
              <button
                onClick={() => handleBuyClick(product)}
                disabled={product.stock === 0}
                className={`w-full py-1.5 rounded-md font-semibold transition-colors flex items-center justify-center text-xs ${
                  product.stock > 0
                    ? "bg-green-400/20 text-green-400 border border-green-400/50 hover:bg-green-400/30"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
              >
                <ShoppingCart className="w-3 h-3 mr-1" />
                {product.stock > 0 ? "ซื้อเลย" : "สินค้าหมด"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/premium"
          className="inline-flex items-center px-6 py-3 border border-amber-500/40 text-base font-medium rounded-lg text-amber-400 bg-gradient-to-r from-neutral-900 to-black hover:from-neutral-800 hover:to-neutral-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
        >
          <Crown className="w-5 h-5 mr-2" />
          ดูสินค้าทั้งหมด
        </Link>
      </div>

      {/* Purchase Modal */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="home-card rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-100">ยืนยันการซื้อ</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Product Image */}
              <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden">
                <Image
                  src={selectedProduct.img}
                  alt={selectedProduct.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.jp/400x300.png";
                  }}
                />
              </div>

              {/* Product Info */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-100 mb-2">
                  {selectedProduct.name}
                </h3>
                <p className="text-sm text-gray-300 mb-4 whitespace-pre-line">
                  {selectedProduct.des || "ไม่มีคำอธิบาย"}
                </p>
                <div className="flex items-center justify-between py-3 px-4 bg-white/5 rounded-lg">
                  <span className="text-gray-300">ราคา</span>
                  <span className="text-2xl font-bold text-indigo-400">
                    ฿{selectedProduct.price}
                  </span>
                </div>
              </div>

              {/* Purchase Result */}
              {purchaseResult && (
                <div
                  className={`mb-4 p-4 rounded-lg flex items-start gap-3 ${purchaseResult.success
                      ? "bg-green-500/10 border border-green-500/20"
                      : "bg-red-500/10 border border-red-500/20"
                    }`}
                >
                  {purchaseResult.success ? (
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium ${purchaseResult.success ? "text-green-400" : "text-red-400"
                        }`}
                    >
                      {purchaseResult.message}
                    </p>
                    {purchaseResult.success && purchaseResult.data && (
                      <p className="text-xs text-gray-300 mt-1">
                        อ้างอิง: {purchaseResult.data.reference}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 text-gray-200 hover:bg-white/15 transition-colors disabled:opacity-50"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={confirmPurchase}
                  disabled={loading || purchaseResult?.success}
                  className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "กำลังซื้อ..." : purchaseResult?.success ? "สำเร็จ" : "ยืนยันการซื้อ"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
