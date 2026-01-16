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
  CreditCard,
  Plus,
  Edit2,
  Trash2,
  GripVertical,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Card {
  id: string;
  name: string;
  icon: string;
  description: string;
  isActive: boolean;
  sort: number;
  cardOptions?: unknown[];
}

interface SortableItemProps {
  card: Card;
  onEdit: (card: Card) => void;
  onDelete: (id: string) => void;
  onManageOptions: (cardId: string) => void;
  onToggle: (id: string, currentStatus: boolean) => void;
}

function SortableItem({ card, onEdit, onDelete, onManageOptions, onToggle }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

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

        {/* Card Icon */}
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
          {card.icon && card.icon !== "-" ? (
            <img src={card.icon} alt={card.name} className="w-10 h-10 object-contain" />
          ) : (
            <CreditCard className="w-6 h-6 text-green-400" />
          )}
        </div>

        {/* Card Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-white">{card.name}</h3>
            {/* Toggle Switch */}
            <button
              onClick={() => onToggle(card.id, card.isActive)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                card.isActive ? 'bg-green-500' : 'bg-gray-600'
              }`}
              title={card.isActive ? 'เปิดใช้งาน - คลิกเพื่อปิด' : 'ปิดใช้งาน - คลิกเพื่อเปิด'}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  card.isActive ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-xs font-medium ${card.isActive ? 'text-green-400' : 'text-gray-400'}`}>
              {card.isActive ? 'เปิด' : 'ปิด'}
            </span>
          </div>
          <p className="text-sm text-gray-400 line-clamp-1">{card.description || "ไม่มีคำอธิบาย"}</p>
          <div className="flex gap-2 mt-1">
            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
              {card.cardOptions?.length || 0} options
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onManageOptions(card.id)}
            className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-all"
            title="จัดการ Options"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(card)}
            className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all"
            title="แก้ไข"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(card.id)}
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

export default function CardsManagementClient({ initialCards }: { initialCards: Card[] }) {
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [formData, setFormData] = useState({
    name: "",
    icon: "",
    description: "",
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
      const oldIndex = cards.findIndex((c) => c.id === active.id);
      const newIndex = cards.findIndex((c) => c.id === over.id);

      const newCards = arrayMove(cards, oldIndex, newIndex);
      const updatedCards = newCards.map((card, index) => ({
        ...card,
        sort: index,
      }));

      setCards(updatedCards);

      try {
        await fetch("/api/admin/cards", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cards: updatedCards.map((c) => ({ id: c.id, sort: c.sort })),
          }),
        });
      } catch (error) {
        console.error("Error updating sort:", error);
        alert("เกิดข้อผิดพลาดในการอัปเดตลำดับ");
        setCards(cards);
      }
    }
  };

  const handleOpenModal = (card?: Card) => {
    if (card) {
      setEditingCard(card);
      setFormData({
        name: card.name,
        icon: card.icon,
        description: card.description,
        isActive: card.isActive,
      });
    } else {
      setEditingCard(null);
      setFormData({
        name: "",
        icon: "",
        description: "",
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingCard
        ? `/api/admin/cards/${editingCard.id}`
        : "/api/admin/cards";
      const method = editingCard ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "เกิดข้อผิดพลาด");
        return;
      }

      alert(editingCard ? "แก้ไขบัตรสำเร็จ" : "เพิ่มบัตรสำเร็จ");
      setIsModalOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error saving card:", error);
      alert("เกิดข้อผิดพลาด");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("คุณแน่ใจว่าต้องการลบบัตรนี้?")) return;

    try {
      const res = await fetch(`/api/admin/cards/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("เกิดข้อผิดพลาดในการลบ");
        return;
      }

      alert("ลบบัตรสำเร็จ");
      setCards(cards.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error deleting card:", error);
      alert("เกิดข้อผิดพลาด");
    }
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    // อัปเดต UI ทันที (Optimistic Update)
    const newStatus = !currentStatus;
    setCards(cards.map((c) => 
      c.id === id ? { ...c, isActive: newStatus } : c
    ));

    // ส่ง request ไป backend
    try {
      const res = await fetch(`/api/admin/cards/${id}/toggle`, {
        method: "PATCH",
      });

      if (!res.ok) {
        // ถ้า error ให้ revert กลับ
        setCards(cards.map((c) => 
          c.id === id ? { ...c, isActive: currentStatus } : c
        ));
        alert("เกิดข้อผิดพลาดในการเปลี่ยนสถานะ");
      }
    } catch (error) {
      // ถ้า error ให้ revert กลับ
      setCards(cards.map((c) => 
        c.id === id ? { ...c, isActive: currentStatus } : c
      ));
      console.error("Error toggling card:", error);
      alert("เกิดข้อผิดพลาด");
    }
  };

  const handleManageOptions = (cardId: string) => {
    router.push(`/admin/cards-management/${cardId}/options`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <CreditCard className="w-8 h-8 text-green-400" />
              จัดการบัตรเติมเงิน
            </h1>
            <p className="text-gray-400 mt-1">
              ลากเพื่อเรียงลำดับ | {cards.length} บัตร
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            เพิ่มบัตรใหม่
          </button>
        </div>

        {/* Cards List with DnD */}
        {mounted && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={cards.map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {cards.map((card) => (
                  <SortableItem
                    key={card.id}
                    card={card}
                    onEdit={handleOpenModal}
                    onDelete={handleDelete}
                    onManageOptions={handleManageOptions}
                    onToggle={handleToggle}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {mounted && cards.length === 0 && (
          <div className="text-center py-20">
            <CreditCard className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">ยังไม่มีบัตร คลิก &quot;เพิ่มบัตรใหม่&quot; เพื่อเริ่มต้น</p>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-white mb-6">
                {editingCard ? "แก้ไขบัตร" : "เพิ่มบัตรใหม่"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    ชื่อบัตร *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    URL Icon
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    คำอธิบาย
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                    className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
                  >
                    {editingCard ? "บันทึก" : "เพิ่ม"}
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
