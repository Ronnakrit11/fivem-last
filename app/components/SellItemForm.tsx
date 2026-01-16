"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Package, Upload, X, Loader2, CheckCircle, ChevronDown } from "lucide-react";

interface Catalog {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export default function SellItemForm() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [loadingCatalogs, setLoadingCatalogs] = useState(false);
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [catalogId, setCatalogId] = useState("");

  useEffect(() => {
    const fetchCatalogs = async () => {
      setLoadingCatalogs(true);
      try {
        const res = await fetch("/api/sell-catalogs");
        const data = await res.json();
        if (data.success) {
          setCatalogs(data.catalogs || []);
        }
      } catch (err) {
        console.error("Error fetching catalogs:", err);
      } finally {
        setLoadingCatalogs(false);
      }
    };
    fetchCatalogs();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload-slip", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setImage(data.url);
      } else {
        alert(data.error || "ไม่สามารถอัพโหลดรูปได้");
      }
    } catch {
      alert("เกิดข้อผิดพลาดในการอัพโหลด");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !description || !price) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/user-sell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          price: parseFloat(price),
          image,
          catalogId: catalogId || null,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setResult({ success: true, message: "ส่งรายการขายสำเร็จ! รอแอดมินตรวจสอบ" });
        setTimeout(() => {
          setShowForm(false);
          setName("");
          setDescription("");
          setPrice("");
          setImage("");
          setCatalogId("");
          setResult(null);
        }, 2000);
      } else {
        setResult({ success: false, message: data.error || "เกิดข้อผิดพลาด" });
      }
    } catch {
      setResult({ success: false, message: "เกิดข้อผิดพลาด" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12">
      <div className="rounded-2xl p-6 glass-panel shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 blur-[80px] rounded-full -z-10" />
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              ขายสินค้าให้เรา
            </h3>
            <p className="text-sm text-slate-400">
              มีสินค้าอยากขาย? ส่งรายละเอียดมาให้เราพิจารณา
            </p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
            >
              ขายสินค้า
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                ชื่อสินค้า <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="เช่น บัญชีเกม, ไอเทม, สกิน..."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                รายละเอียด <span className="text-red-400">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="อธิบายรายละเอียดสินค้าของคุณ..."
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                required
              />
            </div>

            {/* Catalog */}
            {catalogs.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  หมวดหมู่สินค้า
                </label>
                <div className="relative">
                  <select
                    value={catalogId}
                    onChange={(e) => setCatalogId(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-slate-800">เลือกหมวดหมู่ (ไม่บังคับ)</option>
                    {catalogs.map((cat) => (
                      <option key={cat.id} value={cat.id} className="bg-slate-800">
                        {cat.icon ? `${cat.icon} ` : ""}{cat.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            )}

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                ราคาที่ต้องการขาย (บาท) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                min="1"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                รูปภาพสินค้า
              </label>
              {image ? (
                <div className="relative inline-block">
                  <img
                    src={image}
                    alt="Product"
                    className="w-32 h-32 object-cover rounded-xl border border-white/20"
                  />
                  <button
                    type="button"
                    onClick={() => setImage("")}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-green-500/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                  {uploadingImage ? (
                    <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-400">คลิกเพื่ออัพโหลดรูป</span>
                    </>
                  )}
                </label>
              )}
            </div>

            {/* Result */}
            {result && (
              <div className={`p-4 rounded-xl ${result.success ? "bg-green-500/20 border border-green-500/30" : "bg-red-500/20 border border-red-500/30"}`}>
                <div className="flex items-center gap-2">
                  {result.success && <CheckCircle className="w-5 h-5 text-green-400" />}
                  <p className={result.success ? "text-green-400" : "text-red-400"}>
                    {result.message}
                  </p>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setName("");
                  setDescription("");
                  setPrice("");
                  setImage("");
                  setCatalogId("");
                  setResult(null);
                }}
                className="flex-1 px-6 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    กำลังส่ง...
                  </>
                ) : (
                  <>
                    <Package className="w-5 h-5" />
                    ส่งขาย
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
