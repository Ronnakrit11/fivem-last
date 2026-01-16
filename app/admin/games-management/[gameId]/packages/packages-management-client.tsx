"use client";

import { useState, useEffect } from "react";
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
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  GripVertical,
  ArrowLeft,
  Server,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface PackageData {
  id: string;
  name: string;
  price: number;
  priceVip: number;
  priceAgent: number;
  cost: number;
  gameCode: string | null;
  packageCode: string | null;
  icon: string;
  isActive: boolean;
  sort: number;
}

interface Game {
  id: string;
  name: string;
  isServer: boolean;
  icon: string;
  packages: PackageData[];
  mixPackages: unknown[];
}

interface SortableItemProps {
  pkg: PackageData;
  onEdit: (pkg: PackageData) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, currentStatus: boolean) => void;
}

function SortableItem({ pkg, onEdit, onDelete, onToggle }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: pkg.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all"
    >
      <div className="flex items-center gap-4">
        {/* Drag Handle */}
        <button
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-white"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-5 h-5" />
        </button>

        {/* Package Icon */}
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
          {pkg.icon ? (
            <div className="relative w-10 h-10">
              <Image src={pkg.icon} alt={pkg.name} fill className="object-contain" />
            </div>
          ) : (
            <Package className="w-6 h-6 text-purple-400" />
          )}
        </div>

        {/* Package Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-white">{pkg.name}</h3>
            {/* Toggle Switch */}
            <button
              onClick={() => onToggle(pkg.id, pkg.isActive)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                pkg.isActive ? 'bg-green-500' : 'bg-gray-600'
              }`}
              title={pkg.isActive ? 'เปิดใช้งาน - คลิกเพื่อปิด' : 'ปิดใช้งาน - คลิกเพื่อเปิด'}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  pkg.isActive ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-xs font-medium ${pkg.isActive ? 'text-green-400' : 'text-gray-400'}`}>
              {pkg.isActive ? 'เปิด' : 'ปิด'}
            </span>
          </div>
          <div className="flex gap-4 mt-1 text-sm">
            <span className="text-emerald-400">฿{Number(pkg.price).toFixed(2)}</span>
            <span className="text-amber-400">VIP: ฿{Number(pkg.priceVip).toFixed(2)}</span>
            <span className="text-blue-400">Agent: ฿{Number(pkg.priceAgent).toFixed(2)}</span>
          </div>
          <div className="flex gap-2 mt-1 text-xs text-gray-400">
            {pkg.gameCode && <span>Game: {pkg.gameCode}</span>}
            {pkg.packageCode && <span>Package: {pkg.packageCode}</span>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(pkg)}
            className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all"
            title="แก้ไข"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(pkg.id)}
            className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
            title="ลบ"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PackagesManagementClient({ initialGame }: { initialGame: Game }) {
  const router = useRouter();
  // ใช้ initialGame โดยตรง เพื่อให้ข้อมูลอัปเดตเสมอ
  const game = initialGame;
  const [packages, setPackages] = useState<PackageData[]>(initialGame.packages || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PackageData | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    priceVip: "",
    priceAgent: "",
    cost: "",
    gameCode: "",
    packageCode: "",
    icon: "",
    isActive: true,
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
      const oldIndex = packages.findIndex((p) => p.id === active.id);
      const newIndex = packages.findIndex((p) => p.id === over.id);

      const newPackages = arrayMove(packages, oldIndex, newIndex);
      const updatedPackages = newPackages.map((pkg, index) => ({
        ...pkg,
        sort: index,
      }));

      setPackages(updatedPackages);

      try {
        await fetch("/api/admin/packages", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            packages: updatedPackages.map((p) => ({ id: p.id, sort: p.sort })),
          }),
        });
      } catch (error) {
        console.error("Error updating sort:", error);
        alert("เกิดข้อผิดพลาดในการอัปเดตลำดับ");
        setPackages(packages);
      }
    }
  };

  const handleOpenModal = (pkg?: PackageData) => {
    if (pkg) {
      setEditingPackage(pkg);
      setFormData({
        name: pkg.name,
        price: String(pkg.price),
        priceVip: String(pkg.priceVip),
        priceAgent: String(pkg.priceAgent),
        cost: String(pkg.cost),
        gameCode: pkg.gameCode || "",
        packageCode: pkg.packageCode || "",
        icon: pkg.icon || "",
        isActive: pkg.isActive,
      });
    } else {
      setEditingPackage(null);
      setFormData({
        name: "",
        price: "",
        priceVip: "",
        priceAgent: "",
        cost: "",
        gameCode: "",
        packageCode: "",
        icon: "",
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingPackage
        ? `/api/admin/packages/${editingPackage.id}`
        : "/api/admin/packages";
      const method = editingPackage ? "PUT" : "POST";

      const payload = {
        ...formData,
        gameId: game.id,
        price: parseFloat(formData.price) || 0,
        priceVip: parseFloat(formData.priceVip) || 0,
        priceAgent: parseFloat(formData.priceAgent) || 0,
        cost: parseFloat(formData.cost) || 0,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: 'include', // เพิ่มเพื่อให้ส่ง cookie ไปด้วย
      });

      // จัดการกับ 401/403 โดยเฉพาะ
      if (res.status === 401 || res.status === 403) {
        alert("Session หมดอายุ กรุณา Login ใหม่");
        window.location.href = "/";
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "เกิดข้อผิดพลาด" }));
        alert(data.error || "เกิดข้อผิดพลาด");
        return;
      }

      const result = await res.json();
      const updatedPackage = result.package;

      // อัปเดต state โดยตรงแทนการ refresh
      if (editingPackage) {
        // แก้ไข package ที่มีอยู่
        setPackages(packages.map((p) => 
          p.id === editingPackage.id ? updatedPackage : p
        ));
      } else {
        // เพิ่ม package ใหม่
        setPackages([...packages, { ...updatedPackage, sort: packages.length }]);
      }

      alert(editingPackage ? "แก้ไข Package สำเร็จ" : "เพิ่ม Package สำเร็จ");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving package:", error);
      alert("เกิดข้อผิดพลาด: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    // อัปเดต UI ทันที (Optimistic Update)
    const newStatus = !currentStatus;
    setPackages(packages.map((p) => 
      p.id === id ? { ...p, isActive: newStatus } : p
    ));

    // ส่ง request ไป backend
    try {
      const res = await fetch(`/api/admin/packages/${id}/toggle`, {
        method: "PATCH",
      });

      if (!res.ok) {
        // ถ้า error ให้ revert กลับ
        setPackages(packages.map((p) => 
          p.id === id ? { ...p, isActive: currentStatus } : p
        ));
        alert("เกิดข้อผิดพลาดในการเปลี่ยนสถานะ");
      }
    } catch (error) {
      // ถ้า error ให้ revert กลับ
      setPackages(packages.map((p) => 
        p.id === id ? { ...p, isActive: currentStatus } : p
      ));
      console.error("Error toggling package:", error);
      alert("เกิดข้อผิดพลาด");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("คุณแน่ใจว่าต้องการลบ Package นี้?")) return;

    try {
      const res = await fetch(`/api/admin/packages/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("เกิดข้อผิดพลาดในการลบ");
        return;
      }

      alert("ลบ Package สำเร็จ");
      setPackages(packages.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting package:", error);
      alert("เกิดข้อผิดพลาด");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/admin/games-management")}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            กลับไปหน้าจัดการเกม
          </button>

          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Package className="w-8 h-8 text-purple-400" />
                จัดการ Packages - {game.name}
              </h1>
              <p className="text-gray-400 mt-1">
                ลากเพื่อเรียงลำดับ | {packages.length} packages
              </p>
            </div>
            <div className="flex gap-3">
              {game.isServer && (
                <button
                  onClick={() => router.push(`/admin/games-management/${game.id}/servers`)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all shadow-lg flex items-center gap-2"
                >
                  <Server className="w-5 h-5" />
                  จัดการ Servers
                </button>
              )}
              <button
                onClick={() => handleOpenModal()}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                เพิ่ม Package
              </button>
            </div>
          </div>
        </div>

        {/* Packages List with DnD */}
        {mounted && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={packages.map((p) => p.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {packages.map((pkg) => (
                  <SortableItem
                    key={pkg.id}
                    pkg={pkg}
                    onEdit={handleOpenModal}
                    onDelete={handleDelete}
                    onToggle={handleToggle}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {mounted && packages.length === 0 && (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">ยังไม่มี Package คลิก &quot;เพิ่ม Package&quot; เพื่อเริ่มต้น</p>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-white mb-6">
                {editingPackage ? "แก้ไข Package" : "เพิ่ม Package ใหม่"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    ชื่อ Package *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      ราคา (บาท)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      ราคา VIP (บาท)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.priceVip}
                      onChange={(e) => setFormData({ ...formData, priceVip: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      ราคา Agent (บาท)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.priceAgent}
                      onChange={(e) => setFormData({ ...formData, priceAgent: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      ต้นทุน (บาท)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.cost}
                      onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Game Code
                    </label>
                    <input
                      type="text"
                      value={formData.gameCode}
                      onChange={(e) => setFormData({ ...formData, gameCode: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Package Code
                    </label>
                    <input
                      type="text"
                      value={formData.packageCode}
                      onChange={(e) => setFormData({ ...formData, packageCode: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    URL Icon
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-300">
                    เปิดใช้งาน
                  </label>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                  >
                    {editingPackage ? "บันทึก" : "เพิ่ม"}
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
