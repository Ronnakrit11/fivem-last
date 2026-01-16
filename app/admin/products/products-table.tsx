"use client";

import { Package, Edit2, Save, X, Star, Upload } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  price: number;
  pricevip: number;
  agent_price: number;
  stock: number;
  img: string;
  des: string;
  originalPrice?: number;
}

export default function ProductsTable({ 
  products, 
  featuredIds 
}: { 
  products: Product[];
  featuredIds: string[];
}) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editPrice, setEditPrice] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const [localProducts, setLocalProducts] = useState(products);
  const [localFeaturedIds, setLocalFeaturedIds] = useState<Set<string>>(new Set(featuredIds));
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  // Sync products when parent updates
  useEffect(() => {
    setLocalProducts(products);
  }, [products]);

  // Sync featuredIds when parent updates
  useEffect(() => {
    setLocalFeaturedIds(new Set(featuredIds));
  }, [featuredIds]);

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditPrice(product.price.toString());
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditPrice("");
  };

  const handleSave = async (productId: number) => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/update-price", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: productId,
          price: parseFloat(editPrice),
        }),
      });

      if (response.ok) {
        // Update local state
        setLocalProducts(prev =>
          prev.map(p =>
            p.id === productId
              ? { ...p, price: parseFloat(editPrice) }
              : p
          )
        );
        setEditingId(null);
        setEditPrice("");
        alert("อัพเดทราคาสำเร็จ!");
      } else {
        alert("เกิดข้อผิดพลาดในการอัพเดทราคา");
      }
    } catch (error) {
      console.error("Error updating price:", error);
      alert("เกิดข้อผิดพลาดในการอัพเดทราคา");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeatured = async (productId: number) => {
    const productIdStr = productId.toString();
    const isFeatured = !localFeaturedIds.has(productIdStr);
    
    try {
      const response = await fetch("/api/admin/toggle-featured", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: productId,
          isFeatured: isFeatured,
        }),
      });

      if (response.ok) {
        setLocalFeaturedIds(prev => {
          const newSet = new Set(prev);
          if (isFeatured) {
            newSet.add(productIdStr);
          } else {
            newSet.delete(productIdStr);
          }
          return newSet;
        });
      } else {
        alert("เกิดข้อผิดพลาดในการอัพเดทสถานะ Featured");
      }
    } catch (error) {
      console.error("Error toggling featured:", error);
      alert("เกิดข้อผิดพลาดในการอัพเดทสถานะ Featured");
    }
  };

  const handleImageClick = (productId: number) => {
    fileInputRefs.current[productId]?.click();
  };

  const handleImageUpload = async (productId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingId(productId);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("productId", productId.toString());

      const response = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update local state with new image URL
        setLocalProducts(prev =>
          prev.map(p =>
            p.id === productId
              ? { ...p, img: data.url }
              : p
          )
        );
        alert("อัพโหลดรูปภาพสำเร็จ!");
      } else {
        alert(data.error || "เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ");
    } finally {
      setUploadingId(null);
      // Reset file input
      if (fileInputRefs.current[productId]) {
        fileInputRefs.current[productId]!.value = "";
      }
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900">รายการสินค้า</h2>
      </div>

      {products.length > 0 ? (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    สินค้า
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ราคาปกติ
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ราคาตัวแทน
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ราคาสมาชิก
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    สต็อก
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    สถานะ
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Homepage
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {localProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-4">
                      <div className="flex items-center">
                        <div className="relative group mr-3">
                          <Image
                            src={product.img}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-lg object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "https://placehold.jp/150x150.png";
                            }}
                          />
                          <input
                            ref={el => { fileInputRefs.current[product.id] = el; }}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(product.id, e)}
                          />
                          <button
                            onClick={() => handleImageClick(product.id)}
                            disabled={uploadingId === product.id}
                            className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100"
                            title="อัพโหลดรูปใหม่"
                          >
                            {uploadingId === product.id ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Upload className="w-4 h-4 text-white" />
                            )}
                          </button>
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {product.name}
                          </div>
                          <div className="text-xs text-gray-500 truncate max-w-[200px]">
                            {product.des || "-"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap">
                      {editingId === product.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="w-24 px-2 py-1 text-sm border border-indigo-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            disabled={loading}
                          />
                          <button
                            onClick={() => handleSave(product.id)}
                            disabled={loading}
                            className="p-1 text-green-600 hover:text-green-700 disabled:opacity-50"
                            title="บันทึก"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={handleCancel}
                            disabled={loading}
                            className="p-1 text-red-600 hover:text-red-700 disabled:opacity-50"
                            title="ยกเลิก"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <div className="text-sm font-semibold text-gray-900">
                            ฿{product.price}
                          </div>
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-1 text-indigo-600 hover:text-indigo-700"
                            title="แก้ไขราคา"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-indigo-600">
                        ฿{product.pricevip}
                      </div>
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-purple-600">
                        ฿{product.agent_price}
                      </div>
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap">
                      <div className="text-xs text-gray-900">
                        {product.stock}
                      </div>
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap">
                      {product.stock > 0 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          พร้อม
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          หมด
                        </span>
                      )}
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleFeatured(product.id)}
                        className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          localFeaturedIds.has(product.id.toString())
                            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                        title={localFeaturedIds.has(product.id.toString()) ? "แสดงในหน้า Home" : "ไม่แสดงในหน้า Home"}
                      >
                        <Star 
                          className={`w-4 h-4 ${localFeaturedIds.has(product.id.toString()) ? "fill-yellow-500" : ""}`} 
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet Card View */}
          <div className="lg:hidden divide-y divide-gray-200">
            {localProducts.map((product) => (
              <div key={product.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col sm:flex-row items-start sm:space-x-4 space-y-4 sm:space-y-0">
                  {/* Product Image */}
                  <div className="relative group w-full sm:w-24 md:w-32 h-40 sm:h-24 md:h-32 flex-shrink-0">
                    <Image
                      src={product.img}
                      alt={product.name}
                      fill
                      className="rounded-lg object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://placehold.jp/150x150.png";
                      }}
                    />
                    <input
                      ref={el => { fileInputRefs.current[product.id] = el; }}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(product.id, e)}
                    />
                    <button
                      onClick={() => handleImageClick(product.id)}
                      disabled={uploadingId === product.id}
                      className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100"
                      title="อัพโหลดรูปใหม่"
                    >
                      {uploadingId === product.id ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Upload className="w-6 h-6 text-white" />
                      )}
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0 w-full">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 mb-4 line-clamp-2">
                      {product.des || "-"}
                    </p>

                    {/* Prices - Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                      <div className="flex justify-between md:flex-col md:justify-start">
                        <span className="text-sm text-gray-600">ราคาปกติ:</span>
                        {editingId === product.id ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              value={editPrice}
                              onChange={(e) => setEditPrice(e.target.value)}
                              className="w-20 px-2 py-1 text-sm border border-indigo-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              disabled={loading}
                            />
                            <button
                              onClick={() => handleSave(product.id)}
                              disabled={loading}
                              className="p-1 text-green-600 hover:text-green-700 disabled:opacity-50"
                            >
                              <Save className="w-3 h-3" />
                            </button>
                            <button
                              onClick={handleCancel}
                              disabled={loading}
                              className="p-1 text-red-600 hover:text-red-700 disabled:opacity-50"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-base md:text-lg text-gray-900">฿{product.price}</span>
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-1 text-indigo-600 hover:text-indigo-700"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between md:flex-col md:justify-start">
                        <span className="text-sm text-gray-600">ราคาตัวแทน:</span>
                        <span className="font-semibold text-base md:text-lg text-indigo-600">฿{product.pricevip}</span>
                      </div>
                      <div className="flex justify-between md:flex-col md:justify-start">
                        <span className="text-sm text-gray-600">ราคาสมาชิก:</span>
                        <span className="font-semibold text-base md:text-lg text-purple-600">฿{product.agent_price}</span>
                      </div>
                    </div>

                    {/* Stock & Status */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pt-3 border-t border-gray-200">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm md:text-base text-gray-600">
                          สต็อก: <span className="font-medium text-gray-900">{product.stock} ชิ้น</span>
                        </span>
                        {product.stock > 0 ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs md:text-sm font-medium bg-green-100 text-green-800">
                            พร้อมขาย
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs md:text-sm font-medium bg-red-100 text-red-800">
                            หมดสต็อก
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleToggleFeatured(product.id)}
                        className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          localFeaturedIds.has(product.id.toString())
                            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                        title={localFeaturedIds.has(product.id.toString()) ? "แสดงในหน้า Home" : "ไม่แสดงในหน้า Home"}
                      >
                        <Star 
                          className={`w-4 h-4 mr-1 ${localFeaturedIds.has(product.id.toString()) ? "fill-yellow-500" : ""}`} 
                        />
                        {localFeaturedIds.has(product.id.toString()) ? "แสดงใน Home" : "ไม่แสดง"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="px-6 py-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">ไม่พบสินค้า</p>
        </div>
      )}
    </div>
  );
}
