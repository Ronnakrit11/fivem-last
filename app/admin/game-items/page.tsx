"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, X, Upload, Loader2, Edit2, Trash2, ShoppingBag, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface GameItem {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  isCustomPrice: boolean;
  stock: number;
  isUnlimitedStock: boolean;
  isAuction: boolean;
  auctionEndDate: string | null;
  isActive: boolean;
  sort: number;
}

function SortableGameItem({
  item,
  onEdit,
  onDelete,
  deleting,
}: {
  item: GameItem;
  onEdit: (item: GameItem) => void;
  onDelete: (id: string) => void;
  deleting: string | null;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-green-300 transition-all"
    >
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        <button
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 mt-1 flex-shrink-0"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-5 h-5" />
        </button>
        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center overflow-hidden flex-shrink-0">
          {item.image ? (
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <ShoppingBag className="w-8 h-8 text-green-600" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
          <p className="text-sm text-gray-500 line-clamp-1">{item.description || "ไม่มีคำอธิบาย"}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {item.isAuction ? (
              <span className="text-sm font-medium text-amber-600 bg-amber-100 px-2 py-1 rounded">🔨 ประมูล</span>
            ) : item.isCustomPrice ? (
              <span className="text-sm font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded">ราคาแล้วแต่ลูกค้าสั่ง</span>
            ) : (
              <span className="text-lg font-bold text-green-600">฿{item.price.toFixed(2)}</span>
            )}
            <span className={`text-xs px-2 py-0.5 rounded ${item.isUnlimitedStock ? 'bg-blue-100 text-blue-700' : item.stock > 0 ? 'bg-purple-100 text-purple-700' : 'bg-red-100 text-red-700'}`}>
              {item.isUnlimitedStock ? 'ไม่จำกัด' : `คงเหลือ ${item.stock}`}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {item.isActive ? 'เปิด' : 'ปิด'}
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={() => onEdit(item)}
          className="flex-1 px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium flex items-center justify-center gap-1"
        >
          <Edit2 className="w-4 h-4" />
          แก้ไข
        </button>
        <button
          onClick={() => onDelete(item.id)}
          disabled={deleting === item.id}
          className="flex-1 px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium flex items-center justify-center gap-1 disabled:opacity-50"
        >
          {deleting === item.id ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
          ลบ
        </button>
      </div>
    </div>
  );
}

export default function GameItemsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [gameItems, setGameItems] = useState<GameItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GameItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    price: "",
    isCustomPrice: false,
    stock: "",
    isUnlimitedStock: true,
    isAuction: false,
    auctionEndDate: "",
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = gameItems.findIndex((item) => item.id === active.id);
      const newIndex = gameItems.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(gameItems, oldIndex, newIndex);
      const updatedItems = newItems.map((item, index) => ({
        ...item,
        sort: index,
      }));

      setGameItems(updatedItems);

      try {
        await fetch("/api/admin/game-items", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: updatedItems.map((item) => ({ id: item.id, sort: item.sort })),
          }),
        });
      } catch (error) {
        console.error("Error updating sort:", error);
        alert("เกิดข้อผิดพลาดในการอัปเดตลำดับ");
        setGameItems(gameItems);
      }
    }
  };

  useEffect(() => {
    fetch("/api/admin/game-items")
      .then(res => {
        if (res.status === 401) {
          router.push("/auth");
          return null;
        }
        if (res.status === 403) {
          router.push("/dashboard");
          return null;
        }
        return res.ok ? res.json() : null;
      })
      .then(data => {
        if (data) {
          setGameItems(data.items || []);
        }
      })
      .catch(err => {
        console.error("Error fetching data:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const res = await fetch("/api/admin/game-items/upload-image", {
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
    if (!formData.name) {
      alert("กรุณากรอกชื่อสินค้า");
      return;
    }
    // Only require price if not custom price AND not auction
    if (!formData.isCustomPrice && !formData.isAuction && !formData.price) {
      alert("กรุณากรอกราคา");
      return;
    }
    // Require auction end date if auction
    if (formData.isAuction && !formData.auctionEndDate) {
      alert("กรุณาเลือกวันเวลาจบประมูล");
      return;
    }

    setSubmitting(true);
    try {
      const url = editingItem 
        ? `/api/admin/game-items/${editingItem.id}`
        : "/api/admin/game-items";
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
          setGameItems(prev => prev.map(item => item.id === editingItem.id ? data.item : item));
        } else {
          setGameItems(prev => [data.item, ...prev]);
        }
        setIsModalOpen(false);
        setEditingItem(null);
        setFormData({ name: "", description: "", image: "", price: "", isCustomPrice: false, stock: "", isUnlimitedStock: true, isAuction: false, auctionEndDate: "" });
      } else {
        alert(data.error || "เกิดข้อผิดพลาด");
      }
    } catch (error) {
      console.error("Error saving game item:", error);
      alert("เกิดข้อผิดพลาด");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("คุณแน่ใจว่าต้องการลบสินค้านี้?")) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/game-items/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        alert("ลบสินค้าสำเร็จ");
        setGameItems(prev => prev.filter(item => item.id !== id));
      } else {
        alert(data.error || "เกิดข้อผิดพลาด");
      }
    } catch (error) {
      console.error("Error deleting game item:", error);
      alert("เกิดข้อผิดพลาด");
    } finally {
      setDeleting(null);
    }
  };

  const openModal = (item?: GameItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description,
        image: item.image,
        price: item.price.toString(),
        isCustomPrice: item.isCustomPrice || false,
        stock: item.stock?.toString() || "0",
        isUnlimitedStock: item.isUnlimitedStock !== false,
        isAuction: item.isAuction || false,
        auctionEndDate: item.auctionEndDate ? new Date(item.auctionEndDate).toISOString().slice(0, 16) : "",
      });
    } else {
      setEditingItem(null);
      setFormData({ name: "", description: "", image: "", price: "", isCustomPrice: false, stock: "", isUnlimitedStock: true, isAuction: false, auctionEndDate: "" });
    }
    setIsModalOpen(true);
  };


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
                <ShoppingBag className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  จัดการสินค้าไอเทมเกม
                </h1>
                <p className="text-gray-600">
                  เพิ่ม แก้ไข และจัดการสินค้าทั้งหมด
                </p>
              </div>
            </div>
            <button
              onClick={() => openModal()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              เพิ่มสินค้า
            </button>
          </div>
        </div>

        {/* Game Items List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">รายการสินค้าทั้งหมด ({gameItems.length} รายการ)</h2>
          </div>
          
          {loading ? (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-xl p-4 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : gameItems.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={gameItems.map((item) => item.id)}
                strategy={rectSortingStrategy}
              >
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {gameItems.map((item) => (
                    <SortableGameItem
                      key={item.id}
                      item={item}
                      onEdit={openModal}
                      onDelete={handleDelete}
                      deleting={deleting}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="p-12 text-center">
              <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">ยังไม่มีสินค้าในระบบ</p>
              <button
                onClick={() => openModal()}
                className="inline-block mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                เพิ่มสินค้าใหม่
              </button>
            </div>
          )}
        </div>

        {/* Modal เพิ่มสินค้า */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">{editingItem ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="ชื่อสินค้า"
                    required
                  />
                </div>

                {/* คำอธิบาย */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    คำอธิบาย
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="รายละเอียดสินค้า"
                  />
                </div>

                {/* รูปสินค้า */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    รูปสินค้า (PNG, JPG, GIF)
                  </label>
                  {formData.image ? (
                    <div className="flex items-center gap-4">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                      />
                      <div className="flex-1">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                        >
                          {uploading ? "กำลังอัพโหลด..." : "เปลี่ยนรูป"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, image: "" }))}
                          className="ml-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm"
                        >
                          ลบรูป
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="w-full py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-all flex flex-col items-center justify-center gap-2"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
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
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/gif"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* ราคา - ซ่อนถ้าเป็นสินค้าประมูลหรือราคาแล้วแต่ลูกค้าสั่ง */}
                {!formData.isCustomPrice && !formData.isAuction && (
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="0.00"
                      required={!formData.isCustomPrice && !formData.isAuction}
                    />
                  </div>
                )}

                {/* ราคาแล้วแต่ลูกค้าสั่ง - ซ่อนถ้าเป็นสินค้าประมูล */}
                {!formData.isAuction && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <input
                      type="checkbox"
                      id="isCustomPrice"
                      checked={formData.isCustomPrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, isCustomPrice: e.target.checked, price: e.target.checked ? "" : prev.price }))}
                      className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <label htmlFor="isCustomPrice" className="text-sm text-gray-700 cursor-pointer">
                      ราคาสินค้าแล้วแต่ลูกค้าสั่ง
                    </label>
                  </div>
                )}

                {/* สินค้าประมูล */}
                <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <input
                    type="checkbox"
                    id="isAuction"
                    checked={formData.isAuction}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      isAuction: e.target.checked,
                      isCustomPrice: e.target.checked ? false : prev.isCustomPrice,
                      isUnlimitedStock: e.target.checked ? false : prev.isUnlimitedStock,
                      price: e.target.checked ? "" : prev.price,
                      stock: e.target.checked ? "" : prev.stock,
                    }))}
                    className="w-5 h-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                  <label htmlFor="isAuction" className="text-sm text-gray-700 cursor-pointer">
                    สินค้าประมูล
                  </label>
                </div>

                {/* วันเวลาจบประมูล */}
                {formData.isAuction && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      วันเวลาจบประมูล <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.auctionEndDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, auctionEndDate: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      required={formData.isAuction}
                    />
                  </div>
                )}

                {/* สต๊อคไม่จำกัด - ซ่อนถ้าเป็นสินค้าประมูล */}
                {!formData.isAuction && (
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <input
                      type="checkbox"
                      id="isUnlimitedStock"
                      checked={formData.isUnlimitedStock}
                      onChange={(e) => setFormData(prev => ({ ...prev, isUnlimitedStock: e.target.checked, stock: e.target.checked ? "" : prev.stock }))}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="isUnlimitedStock" className="text-sm text-gray-700 cursor-pointer">
                      สต๊อคไม่จำกัด
                    </label>
                  </div>
                )}

                {/* จำนวนสต๊อค - ซ่อนถ้าเป็นสินค้าประมูลหรือสต๊อคไม่จำกัด */}
                {!formData.isAuction && !formData.isUnlimitedStock && (
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="0"
                      required={!formData.isUnlimitedStock && !formData.isAuction}
                    />
                  </div>
                )}

                {/* ปุ่ม */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        กำลังบันทึก...
                      </>
                    ) : (
                      <>
                        {editingItem ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        {editingItem ? "บันทึก" : "เพิ่มสินค้า"}
                      </>
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
