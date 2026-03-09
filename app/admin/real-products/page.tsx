"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, X, Upload, Loader2, Edit2, Trash2, Package, GripVertical, Save } from "lucide-react";

interface RealProduct {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  stock: number;
  isActive: boolean;
  sort: number;
}

export default function AdminRealProductsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<RealProduct[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RealProduct | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [savingSort, setSavingSort] = useState(false);
  const [sortChanged, setSortChanged] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    price: "",
    stock: "",
  });

  useEffect(() => {
    fetch("/api/admin/real-products")
      .then(res => {
        if (res.status === 401) { router.push("/auth"); return null; }
        if (res.status === 403) { router.push("/dashboard"); return null; }
        return res.ok ? res.json() : null;
      })
      .then(data => {
        if (data) setItems(data.items || []);
      })
      .catch(err => console.error("Error:", err))
      .finally(() => setLoading(false));
  }, [router]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      const res = await fetch("/api/admin/real-products/upload-image", {
        method: "POST",
        body: uploadFormData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setFormData(prev => ({ ...prev, image: data.url }));
      } else {
        alert(data.error || "ไม่สามารถอัพโหลดรูปได้");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("เกิดข้อผิดพลาดในการอัพโหลดรูป");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) { alert("กรุณากรอกชื่อสินค้า"); return; }
    if (!formData.price) { alert("กรุณากรอกราคา"); return; }

    setSubmitting(true);
    try {
      const url = editingItem
        ? `/api/admin/real-products/${editingItem.id}`
        : "/api/admin/real-products";
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        alert(editingItem ? "แก้ไขสินค้าสำเร็จ" : "เพิ่มสินค้าสำเร็จ");
        if (editingItem) {
          setItems(prev => prev.map(item => item.id === editingItem.id ? data.item : item));
        } else {
          setItems(prev => [data.item, ...prev]);
        }
        setIsModalOpen(false);
        setEditingItem(null);
        setFormData({ name: "", description: "", image: "", price: "", stock: "" });
      } else {
        alert(data.error || "เกิดข้อผิดพลาด");
      }
    } catch (error) {
      console.error("Error saving:", error);
      alert("เกิดข้อผิดพลาด");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("คุณแน่ใจว่าต้องการลบสินค้านี้?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/real-products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        alert("ลบสินค้าสำเร็จ");
        setItems(prev => prev.filter(item => item.id !== id));
      } else {
        alert(data.error || "เกิดข้อผิดพลาด");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      alert("เกิดข้อผิดพลาด");
    } finally {
      setDeleting(null);
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }
    const newItems = [...items];
    const [moved] = newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, moved);
    setItems(newItems);
    setDraggedIndex(null);
    setDragOverIndex(null);
    setSortChanged(true);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const saveSortOrder = async () => {
    setSavingSort(true);
    try {
      const sortData = items.map((item, idx) => ({ id: item.id, sort: idx }));
      const res = await fetch("/api/admin/real-products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: sortData }),
      });
      const data = await res.json();
      if (data.success) {
        setSortChanged(false);
        alert("บันทึกลำดับสำเร็จ");
      } else {
        alert(data.error || "เกิดข้อผิดพลาด");
      }
    } catch (error) {
      console.error("Error saving sort:", error);
      alert("เกิดข้อผิดพลาด");
    } finally {
      setSavingSort(false);
    }
  };

  const openModal = (item?: RealProduct) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description,
        image: item.image,
        price: item.price.toString(),
        stock: item.stock.toString(),
      });
    } else {
      setEditingItem(null);
      setFormData({ name: "", description: "", image: "", price: "", stock: "" });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            กลับไปหน้าจัดการ
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mr-4">
                <Package className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">จัดการสินค้าจริง</h1>
                <p className="text-gray-600">เพิ่ม แก้ไข และจัดการสินค้าจริงทั้งหมด</p>
              </div>
            </div>
            <button
              onClick={() => openModal()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold hover:from-rose-700 hover:to-pink-700 transition-all shadow-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              เพิ่มสินค้า
            </button>
          </div>
        </div>

        {/* Items List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">รายการสินค้าทั้งหมด ({items.length} รายการ)</h2>
          </div>

          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-xl p-4 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 bg-gray-200 rounded" />
                    <div className="w-16 h-16 bg-gray-200 rounded-lg" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : items.length > 0 ? (
            <div className="p-6 space-y-2">
              {sortChanged && (
                <div className="flex items-center justify-between p-3 mb-2 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-700 font-medium">ลำดับมีการเปลี่ยนแปลง กรุณากดบันทึก</p>
                  <button
                    onClick={saveSortOrder}
                    disabled={savingSort}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    {savingSort ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    บันทึกลำดับ
                  </button>
                </div>
              )}
              <p className="text-xs text-gray-400 mb-2">ลากเพื่อเรียงลำดับการแสดงผลในหน้าเว็บ</p>
              {items.map((item, index) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={() => handleDrop(index)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-grab active:cursor-grabbing ${
                    draggedIndex === index
                      ? "opacity-50 border-rose-300 bg-rose-50"
                      : dragOverIndex === index
                      ? "border-rose-400 bg-rose-50 shadow-md"
                      : "bg-gray-50 border-gray-200 hover:border-rose-300"
                  }`}
                >
                  <div className="flex-shrink-0 text-gray-400 hover:text-gray-600">
                    <GripVertical className="w-5 h-5" />
                  </div>
                  <span className="w-7 h-7 rounded-full bg-gray-200 text-gray-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </span>
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-7 h-7 text-rose-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-sm font-bold text-rose-600">฿{item.price.toFixed(2)}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${item.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        คงเหลือ {item.stock}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {item.isActive ? 'เปิด' : 'ปิด'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); openModal(item); }}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                      title="แก้ไข"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                      disabled={deleting === item.id}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                      title="ลบ"
                    >
                      {deleting === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">ยังไม่มีสินค้าในระบบ</p>
              <button
                onClick={() => openModal()}
                className="inline-block mt-4 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
              >
                เพิ่มสินค้าใหม่
              </button>
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">{editingItem ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* ชื่อสินค้า */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ชื่อสินค้า <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="ชื่อสินค้า"
                    required
                  />
                </div>

                {/* คำอธิบาย */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">คำอธิบาย</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="รายละเอียดสินค้า"
                  />
                </div>

                {/* รูปสินค้า */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">รูปสินค้า</label>
                  {formData.image ? (
                    <div className="flex items-center gap-4">
                      <img src={formData.image} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                      <div className="flex-1">
                        <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                          {uploading ? "กำลังอัพโหลด..." : "เปลี่ยนรูป"}
                        </button>
                        <button type="button" onClick={() => setFormData(prev => ({ ...prev, image: "" }))}
                          className="ml-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm">
                          ลบรูป
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                      className="w-full py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-rose-400 hover:bg-rose-50 transition-all flex flex-col items-center justify-center gap-2">
                      {uploading ? (
                        <>
                          <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
                          <span className="text-sm text-gray-500">กำลังอัพโหลด...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400" />
                          <span className="text-sm text-gray-500">คลิกเพื่ออัพโหลดรูปภาพ</span>
                          <span className="text-xs text-gray-400">PNG, JPG, GIF (สูงสุด 5MB)</span>
                        </>
                      )}
                    </button>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                    onChange={handleImageUpload} className="hidden" />
                </div>

                {/* ราคา */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ราคา (บาท) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="0.00"
                    required
                  />
                </div>

                {/* จำนวนสต๊อค */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    จำนวนสต๊อค <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="0"
                    required
                  />
                </div>

                {/* ปุ่ม */}
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    ยกเลิก
                  </button>
                  <button type="submit" disabled={submitting}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-lg hover:from-rose-700 hover:to-pink-700 transition-all font-medium disabled:opacity-50 flex items-center justify-center gap-2">
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        กำลังบันทึก...
                      </>
                    ) : (
                      editingItem ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
