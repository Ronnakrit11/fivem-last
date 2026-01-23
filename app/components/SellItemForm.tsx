"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Package, Upload, X, Loader2, CheckCircle, ChevronDown, Shield } from "lucide-react";

interface Catalog {
  id: string;
  name: string;
  description: string;
  icon: string;
  image: string | null;
}

interface SellPolicy {
  id: string;
  title: string;
  content: string;
}

export default function SellItemForm() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [selectedCatalog, setSelectedCatalog] = useState<Catalog | null>(null);
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
  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [sellPolicy, setSellPolicy] = useState<SellPolicy | null>(null);
  const [acceptedSellPolicy, setAcceptedSellPolicy] = useState(false);
  const [showSellPolicyModal, setShowSellPolicyModal] = useState(false);

  const openSellModal = (catalog: Catalog) => {
    setSelectedCatalog(catalog);
    setCatalogId(catalog.id);
    setBankName("");
    setBankAccount("");
    setAcceptedSellPolicy(false);
    fetchSellPolicy();
    setShowForm(true);
  };

  const fetchSellPolicy = async () => {
    try {
      const res = await fetch("/api/sell-policy");
      const data = await res.json();
      if (data.policy) {
        setSellPolicy(data.policy);
      }
    } catch (error) {
      console.error("Error fetching sell policy:", error);
    }
  };

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

    if (sellPolicy && !acceptedSellPolicy) {
      setResult({ success: false, message: "กรุณายอมรับนโยบายการขายสินค้า" });
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
          bankName,
          bankAccount,
          acceptedSellPolicy,
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
        
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-1">
            ขายสินค้าให้เรา
          </h3>
          <p className="text-sm text-slate-400">
            มีสินค้าอยากขาย? เลือกหมวดหมู่แล้วส่งรายละเอียดมาให้เราพิจารณา
          </p>
        </div>

        {/* Catalog Cards Grid */}
        {loadingCatalogs ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
          </div>
        ) : catalogs.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {catalogs.map((catalog) => (
              <div
                key={catalog.id}
                onClick={() => openSellModal(catalog)}
                className="group cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 hover:border-green-500/50 rounded-xl p-4 transition-all duration-300"
              >
                <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                  {catalog.image ? (
                    <img 
                      src={catalog.image} 
                      alt={catalog.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : catalog.icon ? (
                    <span className="text-4xl">{catalog.icon}</span>
                  ) : (
                    <Package className="w-12 h-12 text-green-400" />
                  )}
                </div>
                <h4 className="font-semibold text-white text-center text-sm mb-2 line-clamp-1">
                  {catalog.name}
                </h4>
                <button className="w-full px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all">
                  ขายสินค้า
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">ยังไม่มีหมวดหมู่สินค้า</p>
          </div>
        )}

        {/* Alternative: Direct Sell Form without catalog */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-lg font-semibold text-white">หรือขายสินค้าโดยไม่เลือกหมวดหมู่</h4>
              <p className="text-sm text-slate-400">ไม่พบหมวดหมู่ที่ต้องการ? กรอกข้อมูลด้านล่างได้เลย</p>
            </div>
            <button
              onClick={() => {
                setSelectedCatalog(null);
                setCatalogId("");
                setBankName("");
                setBankAccount("");
                setAcceptedSellPolicy(false);
                fetchSellPolicy();
                setShowForm(true);
              }}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white text-sm rounded-lg font-medium hover:from-orange-600 hover:to-amber-700 transition-all flex items-center gap-2"
            >
              <Package className="w-4 h-4" />
              ขายสินค้าอื่นๆ
            </button>
          </div>
        </div>
      </div>

      {/* Sell Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  {selectedCatalog?.image ? (
                    <img src={selectedCatalog.image} alt={selectedCatalog.name} className="w-10 h-10 rounded-lg object-cover" />
                  ) : selectedCatalog?.icon ? (
                    <span className="text-2xl">{selectedCatalog.icon}</span>
                  ) : (
                    <Package className="w-6 h-6 text-green-400" />
                  )}
                  <div>
                    <h2 className="text-xl font-bold text-white">ขายสินค้า</h2>
                    {selectedCatalog && (
                      <p className="text-sm text-gray-400">หมวดหมู่: {selectedCatalog.name}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setSelectedCatalog(null);
                    setName("");
                    setDescription("");
                    setPrice("");
                    setImage("");
                    setCatalogId("");
                    setResult(null);
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
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

                {/* Bank Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      ธนาคารรับเงิน <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="เช่น กสิกรไทย, กรุงเทพ..."
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      เลขบัญชีรับเงิน <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={bankAccount}
                      onChange={(e) => setBankAccount(e.target.value)}
                      placeholder="xxx-x-xxxxx-x"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
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

                {/* Sell Policy Acceptance */}
                {sellPolicy && (
                  <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                    <input
                      type="checkbox"
                      id="acceptSellPolicy"
                      checked={acceptedSellPolicy}
                      onChange={(e) => setAcceptedSellPolicy(e.target.checked)}
                      className="mt-1 w-4 h-4 text-orange-600 rounded focus:ring-orange-500 bg-white/10 border-white/20"
                    />
                    <label htmlFor="acceptSellPolicy" className="text-sm text-gray-300">
                      ข้าพเจ้ายอมรับ{" "}
                      <button
                        type="button"
                        onClick={() => setShowSellPolicyModal(true)}
                        className="text-orange-400 hover:text-orange-300 underline"
                      >
                        {sellPolicy.title}
                      </button>
                    </label>
                  </div>
                )}

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
                      setSelectedCatalog(null);
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
                    disabled={loading || (!!sellPolicy && !acceptedSellPolicy)}
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
            </div>
          </div>
        </div>
      )}

      {/* Sell Policy Modal */}
      {showSellPolicyModal && sellPolicy && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4"
          onClick={() => setShowSellPolicyModal(false)}
        >
          <div 
            className="bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-orange-400" />
                <h3 className="text-xl font-bold text-gray-100">{sellPolicy.title}</h3>
              </div>
              <button
                onClick={() => setShowSellPolicyModal(false)}
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div 
                className="prose prose-invert prose-sm max-w-none text-gray-300"
                dangerouslySetInnerHTML={{ __html: sellPolicy.content }}
              />
            </div>

            <div className="p-6 border-t border-white/10 flex gap-3">
              <button
                onClick={() => setShowSellPolicyModal(false)}
                className="flex-1 px-4 py-3 bg-white/10 text-gray-200 rounded-xl font-medium hover:bg-white/15 transition-colors"
              >
                ปิด
              </button>
              <button
                onClick={() => {
                  setAcceptedSellPolicy(true);
                  setShowSellPolicyModal(false);
                }}
                className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-colors"
              >
                ยอมรับนโยบาย
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
