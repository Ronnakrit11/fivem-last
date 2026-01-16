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
  Settings,
  Plus,
  Edit2,
  Trash2,
  GripVertical,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface CardOption {
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

interface Card {
  id: string;
  name: string;
  icon: string;
  cardOptions: CardOption[];
}

interface SortableItemProps {
  option: CardOption;
  onEdit: (option: CardOption) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, currentStatus: boolean) => void;
}

function SortableItem({ option, onEdit, onDelete, onToggle }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: option.id });

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
        <button
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-white"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
          {option.icon ? (
            <div className="relative w-10 h-10">
              <Image src={option.icon} alt={option.name} fill className="object-contain" />
            </div>
          ) : (
            <Settings className="w-6 h-6 text-emerald-400" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-white">{option.name}</h3>
            {/* Toggle Switch */}
            <button
              onClick={() => onToggle(option.id, option.isActive)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                option.isActive ? 'bg-green-500' : 'bg-gray-600'
              }`}
              title={option.isActive ? 'เปิดใช้งาน - คลิกเพื่อปิด' : 'ปิดใช้งาน - คลิกเพื่อเปิด'}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  option.isActive ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-xs font-medium ${option.isActive ? 'text-green-400' : 'text-gray-400'}`}>
              {option.isActive ? 'เปิด' : 'ปิด'}
            </span>
          </div>
          <div className="flex gap-4 mt-1 text-sm">
            <span className="text-emerald-400">฿{Number(option.price).toFixed(2)}</span>
            <span className="text-amber-400">VIP: ฿{Number(option.priceVip).toFixed(2)}</span>
            <span className="text-blue-400">Agent: ฿{Number(option.priceAgent).toFixed(2)}</span>
          </div>
          <div className="flex gap-2 mt-1 text-xs text-gray-400">
            {option.gameCode && <span>Game: {option.gameCode}</span>}
            {option.packageCode && <span>Package: {option.packageCode}</span>}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(option)}
            className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all"
            title="แก้ไข"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(option.id)}
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

export default function CardOptionsManagementClient({ initialCard }: { initialCard: Card }) {
  const router = useRouter();
  const [card] = useState<Card>(initialCard);
  const [options, setOptions] = useState<CardOption[]>(initialCard.cardOptions || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<CardOption | null>(null);
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
      const oldIndex = options.findIndex((o) => o.id === active.id);
      const newIndex = options.findIndex((o) => o.id === over.id);

      const newOptions = arrayMove(options, oldIndex, newIndex);
      const updatedOptions = newOptions.map((opt, index) => ({
        ...opt,
        sort: index,
      }));

      setOptions(updatedOptions);

      try {
        await fetch("/api/admin/card-options", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cardOptions: updatedOptions.map((o) => ({ id: o.id, sort: o.sort })),
          }),
        });
      } catch (error) {
        console.error("Error updating sort:", error);
        alert("เกิดข้อผิดพลาดในการอัปเดตลำดับ");
        setOptions(options);
      }
    }
  };

  const handleOpenModal = (option?: CardOption) => {
    if (option) {
      setEditingOption(option);
      setFormData({
        name: option.name,
        price: String(option.price),
        priceVip: String(option.priceVip),
        priceAgent: String(option.priceAgent),
        cost: String(option.cost),
        gameCode: option.gameCode || "",
        packageCode: option.packageCode || "",
        icon: option.icon || "",
        isActive: option.isActive,
      });
    } else {
      setEditingOption(null);
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
      const url = editingOption
        ? `/api/admin/card-options/${editingOption.id}`
        : "/api/admin/card-options";
      const method = editingOption ? "PUT" : "POST";

      const payload = {
        ...formData,
        cardId: card.id,
        price: parseFloat(formData.price) || 0,
        priceVip: parseFloat(formData.priceVip) || 0,
        priceAgent: parseFloat(formData.priceAgent) || 0,
        cost: parseFloat(formData.cost) || 0,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "เกิดข้อผิดพลาด");
        return;
      }

      alert(editingOption ? "แก้ไข Option สำเร็จ" : "เพิ่ม Option สำเร็จ");
      setIsModalOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error saving option:", error);
      alert("เกิดข้อผิดพลาด");
    }
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    // อัปเดต UI ทันที (Optimistic Update)
    const newStatus = !currentStatus;
    setOptions(options.map((o) => 
      o.id === id ? { ...o, isActive: newStatus } : o
    ));

    // ส่ง request ไป backend
    try {
      const res = await fetch(`/api/admin/card-options/${id}/toggle`, {
        method: "PATCH",
      });

      if (!res.ok) {
        // ถ้า error ให้ revert กลับ
        setOptions(options.map((o) => 
          o.id === id ? { ...o, isActive: currentStatus } : o
        ));
        alert("เกิดข้อผิดพลาดในการเปลี่ยนสถานะ");
      }
    } catch (error) {
      // ถ้า error ให้ revert กลับ
      setOptions(options.map((o) => 
        o.id === id ? { ...o, isActive: currentStatus } : o
      ));
      console.error("Error toggling option:", error);
      alert("เกิดข้อผิดพลาด");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("คุณแน่ใจว่าต้องการลบ Option นี้?")) return;

    try {
      const res = await fetch(`/api/admin/card-options/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("เกิดข้อผิดพลาดในการลบ");
        return;
      }

      alert("ลบ Option สำเร็จ");
      setOptions(options.filter((o) => o.id !== id));
    } catch (error) {
      console.error("Error deleting option:", error);
      alert("เกิดข้อผิดพลาด");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.push("/admin/cards-management")}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            กลับไปหน้าจัดการบัตร
          </button>

          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Settings className="w-8 h-8 text-emerald-400" />
                จัดการ Options - {card.name}
              </h1>
              <p className="text-gray-400 mt-1">
                ลากเพื่อเรียงลำดับ | {options.length} options
              </p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              เพิ่ม Option
            </button>
          </div>
        </div>

        {mounted && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={options.map((o) => o.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {options.map((option) => (
                  <SortableItem
                    key={option.id}
                    option={option}
                    onEdit={handleOpenModal}
                    onDelete={handleDelete}
                    onToggle={handleToggle}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {mounted && options.length === 0 && (
          <div className="text-center py-20">
            <Settings className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">ยังไม่มี Option คลิก &quot;เพิ่ม Option&quot; เพื่อเริ่มต้น</p>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-white mb-6">
                {editingOption ? "แก้ไข Option" : "เพิ่ม Option ใหม่"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    ชื่อ Option *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                    className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg"
                  >
                    {editingOption ? "บันทึก" : "เพิ่ม"}
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
