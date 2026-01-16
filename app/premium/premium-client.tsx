"use client";

import { useState, useEffect } from "react";
import { Crown, ShoppingCart, Package, X, CheckCircle, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useBalance } from "@/app/contexts/BalanceContext";
import DOMPurify from "isomorphic-dompurify";

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

export default function PremiumClient({ 
  initialProducts
}: { 
  initialProducts: Product[];
}) {
  const router = useRouter();
  const { updateBalance } = useBalance();
  const [products] = useState<Product[]>(initialProducts);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);

  // Check session on client side
  useEffect(() => {
    // Use better-auth session endpoint
    fetch("/api/auth/get-session", {
      method: "GET",
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        setIsLoggedIn(!!data.session || !!data.user);
        setSessionChecked(true);
      })
      .catch(() => {
        setIsLoggedIn(false);
        setSessionChecked(true);
      });
  }, []);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [purchaseResult, setPurchaseResult] = useState<{
    success: boolean;
    message: string;
    data?: {
      product: string;
      reference: string;
      price: number;
      newBalance: number;
    };
  } | null>(null);

  const handleBuyProduct = (product: Product) => {
    // Check if user is logged in
    if (!isLoggedIn) {
      if (confirm("คุณต้อง Login ก่อนซื้อสินค้า\nต้องการไปหน้า Login หรือไม่?")) {
        window.location.href = "/auth";
      }
      return;
    }
    
    setSelectedProduct(product);
    setShowModal(true);
    setPurchaseResult(null);
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
        // Update balance immediately
        if (data.data?.newBalance !== undefined) {
          updateBalance(data.data.newBalance);
        }
        // Redirect to app-history page after successful purchase
        setTimeout(() => {
          router.push("/app-history");
        }, 1500);
      } else {
        setPurchaseResult({
          success: false,
          message: data.message || "เกิดข้อผิดพลาดในการซื้อสินค้า",
        });
      }
    } catch (error) {
      console.error("Purchase error:", error);
      setPurchaseResult({
        success: false,
        message: "เกิดข้อผิดพลาดในการเชื่อมต่อ",
      });
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setPurchaseResult(null);
  };

  return (
    <>
      {/* Login Alert for non-logged in users - only show after session check */}
      {sessionChecked && !isLoggedIn && (
        <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                คุณต้อง <a href="/auth" className="font-semibold underline hover:text-yellow-800">Login</a> ก่อนจึงจะสามารถซื้อสินค้าได้
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-4">
          <Crown className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          แอพพรีเมี่ยม
        </h1>
        <p className="text-lg text-gray-600">
          สินค้าแอพพรีเมี่ยมคุณภาพสูง พร้อมส่งทันที
        </p>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">กำลังโหลดสินค้า...</p>
        </div>
      ) : products.filter(p => p.stock > 0).length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
          {products.filter(product => product.stock > 0).map((product) => (
            <div
              key={product.id}
              className="rounded-xl overflow-hidden flex flex-col transition-all home-card shadow-md hover:shadow-lg hover:scale-105"
            >
              {/* Product Image */}
              <div className="relative h-40 md:h-48 bg-gradient-to-br from-indigo-50 to-purple-50">
                <Image
                  src={product.img}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover"
                  loading="lazy"
                  quality={75}
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.jp/300x200.png";
                  }}
                />
                {product.stock > 0 ? (
                  <div className="absolute top-2 md:top-3 right-2 md:right-3 bg-red-500 text-white px-2 md:px-3 py-1 rounded-full text-xs font-semibold">
                    คงเหลือ {product.stock}
                  </div>
                ) : (
                  <div className="absolute top-2 md:top-3 right-2 md:right-3 bg-red-500 text-white px-2 md:px-3 py-1 rounded-full text-xs font-semibold">
                    สินค้าหมด
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4 md:p-6 flex flex-col flex-grow">
                <h3 className="text-base md:text-xl font-bold text-gray-200 mb-2 line-clamp-2 min-h-[3rem] md:min-h-[3.5rem]">
                  {product.name}
                </h3>
                <p className="text-xs md:text-sm text-gray-400 mb-3 md:mb-4 line-clamp-2">
                  {product.des || "สินค้าคุณภาพสูง พร้อมส่งทันที"}
                </p>

                {/* Pricing */}
                <div className="mb-3 md:mb-4 mt-auto">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs md:text-sm text-gray-300">ราคา:</span>
                    <span className="text-2xl md:text-3xl font-bold text-[#03AC13]">
                      ฿{product.price}
                    </span>
                  </div>
                </div>

                {/* Buy Button */}
                <button
                  onClick={() => handleBuyProduct(product)}
                  disabled={product.stock === 0}
                  className={`w-full py-2 md:py-3 rounded-lg font-semibold transition-colors flex items-center justify-center text-sm md:text-base ${
                    product.stock > 0
                      ? "bg-[#03AC13] text-white hover:bg-[#029a11]"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  {product.stock > 0 ? "ซื้อเลย" : "สินค้าหมด"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">ไม่พบสินค้า</p>
        </div>
      )}

      {/* Info Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          เกี่ยวกับแอพพรีเมี่ยม
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <ShoppingCart className="w-6 h-6 text-indigo-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">สั่งง่าย</h4>
            <p className="text-sm text-gray-600">
              สั่งซื้อง่าย รวดเร็ว ผ่านระบบอัตโนมัติ
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">ส่งเร็ว</h4>
            <p className="text-sm text-gray-600">
              ส่งสินค้าทันที หลังชำระเงินสำเร็จ
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Crown className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">คุณภาพสูง</h4>
            <p className="text-sm text-gray-600">
              สินค้าคุณภาพ รับประกันความพึงพอใจ
            </p>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="home-card rounded-2xl max-w-md w-full relative my-auto max-h-[90vh] flex flex-col">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {!purchaseResult ? (
              <>
                {/* Header - Fixed */}
                <div className="p-6 pb-0">
                  <h3 className="text-2xl font-bold text-gray-100 mb-4">
                    ยืนยันการซื้อ
                  </h3>
                </div>
                
                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto px-6">
                  <div className="relative w-full h-48 mb-4">
                    <Image
                      src={selectedProduct.img}
                      alt={selectedProduct.name}
                      fill
                      sizes="400px"
                      className="object-cover rounded-lg"
                      priority
                      quality={85}
                      onError={(e) => {
                        e.currentTarget.src = "https://placehold.jp/300x200.png";
                      }}
                    />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-100 mb-3">
                    {selectedProduct.name}
                  </h4>
                  
                  {/* Product Description with HTML rendering */}
                  {selectedProduct.des && (
                    <div 
                      className="text-sm text-gray-300 mb-4 leading-relaxed product-description max-h-60 md:max-h-80 overflow-y-auto"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedProduct.des) }}
                    />
                  )}
                  
                  <div className="bg-white/5 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-medium">ราคา:</span>
                      <span className="text-2xl font-bold text-[#03AC13]">
                        ฿{selectedProduct.price}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons - Fixed at bottom */}
                <div className="p-6 pt-4 border-t border-white/10">
                  <div className="flex space-x-3">
                    <button
                      onClick={closeModal}
                      disabled={loading}
                      className="flex-1 px-4 py-3 rounded-lg bg-white/10 text-gray-200 hover:bg-white/15 transition-colors disabled:opacity-50"
                    >
                      ยกเลิก
                    </button>
                    <button
                      onClick={confirmPurchase}
                      disabled={loading}
                      className="flex-1 px-4 py-3 bg-[#03AC13] text-white rounded-lg font-semibold hover:bg-[#029a11] disabled:opacity-50 flex items-center justify-center"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5 mr-2" />
                          ซื้อเลย
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                <style jsx global>{`
                  .product-description {
                    line-height: 1.8;
                    padding: 1rem;
                    background-color: transparent;
                    border-radius: 0.5rem;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    font-size: 0.9rem;
                    white-space: pre-line;
                    scrollbar-width: thin;
                    scrollbar-color: rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1);
                  }
                  .product-description::-webkit-scrollbar {
                    width: 8px;
                  }
                  .product-description::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 4px;
                  }
                  .product-description::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 4px;
                  }
                  .product-description::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.4);
                  }
                  .product-description * {
                    margin-bottom: 0.5rem;
                  }
                  .product-description p {
                    margin-bottom: 0.75rem;
                    line-height: 1.7;
                  }
                  .product-description br {
                    display: block;
                    content: "";
                    margin-top: 0.5rem;
                  }
                  .product-description .badge {
                    display: inline-block;
                    padding: 0.35rem 0.6rem;
                    margin: 0 0.25rem;
                    border-radius: 0.5rem;
                    font-size: 0.75rem;
                    font-weight: 600;
                    white-space: nowrap;
                  }
                  .product-description .bg-dark {
                    background-color: #1f2937;
                    color: white;
                  }
                  .product-description .bg-warning {
                    background-color: #fbbf24;
                    color: #78350f;
                  }
                  .product-description .text-light {
                    color: white;
                  }
                  .product-description a {
                    color: #818cf8;
                    text-decoration: underline;
                    word-break: break-word;
                    display: inline;
                  }
                  .product-description a:hover {
                    color: #a5b4fc;
                  }
                  .product-description ul,
                  .product-description ol {
                    padding-left: 0;
                    margin-left: 0;
                  }
                  .product-description li {
                    list-style: none;
                    margin-bottom: 0.5rem;
                    padding-left: 0;
                    line-height: 1.7;
                  }
                  .product-description i.fa,
                  .product-description i.fas,
                  .product-description i.far {
                    font-style: normal;
                    margin: 0 0.25rem;
                  }
                  .product-description i:not(.fa):not(.fas):not(.far) {
                    font-style: italic;
                    color: #9ca3af;
                  }
                  .product-description span {
                    display: inline;
                  }
                  .product-description > div {
                    margin-bottom: 0.75rem;
                  }
                `}</style>
              </>
            ) : (
              <>
                {/* Purchase Result */}
                <div className="text-center py-6">
                  {purchaseResult.success ? (
                    <>
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-100 mb-2">
                        สำเร็จ!
                      </h3>
                      <p className="text-gray-300 mb-4">{purchaseResult.message}</p>
                      
                      {purchaseResult.data && (
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4 text-left">
                          <p className="text-sm text-gray-300 mb-2">
                            <strong>สินค้า:</strong> {purchaseResult.data.product}
                          </p>
                          <p className="text-sm text-gray-300 mb-2">
                            <strong>รหัสอ้างอิง:</strong> {purchaseResult.data.reference}
                          </p>
                          <p className="text-sm text-gray-300">
                            <strong>ยอดเงินคงเหลือ:</strong> ฿{purchaseResult.data.newBalance.toFixed(2)}
                          </p>
                        </div>
                      )}
                      
                      <p className="text-sm text-gray-400">กำลังรีเฟรชหน้า...</p>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-10 h-10 text-red-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-100 mb-2">
                        ไม่สำเร็จ
                      </h3>
                      <p className="text-gray-300 mb-6">{purchaseResult.message}</p>
                      
                      <button
                        onClick={closeModal}
                        className="w-full px-4 py-3 bg-white/10 text-gray-200 rounded-lg font-semibold hover:bg-white/15 transition-colors"
                      >
                        ปิด
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
