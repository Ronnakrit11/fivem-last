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
  Gamepad2,
  Plus,
  Edit2,
  Trash2,
  GripVertical,
  Package,
  ImageIcon,
  Server,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef } from "react";

interface Game {
  id: string;
  name: string;
  icon: string;
  description: string;
  isPlayerId: boolean;
  playerFieldName: string;
  isServer: boolean;
  isActive: boolean;
  isFeatured: boolean;
  sort: number;
  packages?: unknown[];
  mixPackages?: unknown[];
}

interface SortableItemProps {
  game: Game;
  onEdit: (game: Game) => void;
  onDelete: (id: string) => void;
  onManagePackages: (gameId: string) => void;
  onManageServers: (gameId: string) => void;
  onToggle: (id: string, currentStatus: boolean) => void;
  onToggleFeatured: (id: string, currentStatus: boolean) => void;
}

function SortableItem({ game, onEdit, onDelete, onManagePackages, onManageServers, onToggle, onToggleFeatured }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: game.id });

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

        {/* Game Icon */}
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
          {game.icon && game.icon !== "-" ? (
            <img src={game.icon} alt={game.name} className="w-10 h-10 object-contain" />
          ) : (
            <Gamepad2 className="w-6 h-6 text-indigo-400" />
          )}
        </div>

        {/* Game Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-white">{game.name}</h3>
            {/* Toggle Switch */}
            <button
              onClick={() => onToggle(game.id, game.isActive)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                game.isActive ? 'bg-green-500' : 'bg-gray-600'
              }`}
              title={game.isActive ? 'เปิดใช้งาน - คลิกเพื่อปิด' : 'ปิดใช้งาน - คลิกเพื่อเปิด'}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  game.isActive ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-xs font-medium ${game.isActive ? 'text-green-400' : 'text-gray-400'}`}>
              {game.isActive ? 'เปิด' : 'ปิด'}
            </span>
          </div>
          <p className="text-sm text-gray-400 line-clamp-1">{game.description || "ไม่มีคำอธิบาย"}</p>
          <div className="flex gap-2 mt-1">
            {game.isPlayerId && (
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                {game.playerFieldName}
              </span>
            )}
            {game.isServer && (
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
                Server
              </span>
            )}
            <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">
              {game.packages?.length || 0} packages
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {/* Featured Star Button */}
          <button
            onClick={() => onToggleFeatured(game.id, game.isFeatured)}
            className={`p-2 rounded-lg transition-all ${
              game.isFeatured
                ? "bg-yellow-500/30 text-yellow-400 hover:bg-yellow-500/40"
                : "bg-gray-500/20 text-gray-400 hover:bg-gray-500/30"
            }`}
            title={game.isFeatured ? "ยกเลิกเกมยอดนิยม" : "ตั้งเป็นเกมยอดนิยม"}
          >
            <Star className={`w-4 h-4 ${game.isFeatured ? "fill-yellow-400" : ""}`} />
          </button>
          {game.isServer && (
            <button
              onClick={() => onManageServers(game.id)}
              className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-all"
              title="จัดการ Server"
            >
              <Server className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onManagePackages(game.id)}
            className="p-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-all"
            title="จัดการ Packages"
          >
            <Package className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(game)}
            className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all"
            title="แก้ไข"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(game.id)}
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

export default function GamesManagementClient({ initialGames }: { initialGames: Game[] }) {
  const router = useRouter();
  const [games, setGames] = useState<Game[]>(initialGames);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [mounted, setMounted] = useState(false);
  const [uploadingIcon, setUploadingIcon] = useState(false);
  const iconInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    icon: "",
    description: "",
    isPlayerId: false,
    playerFieldName: "UID",
    isServer: false,
    isActive: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = games.findIndex((g) => g.id === active.id);
      const newIndex = games.findIndex((g) => g.id === over.id);

      const newGames = arrayMove(games, oldIndex, newIndex);
      const updatedGames = newGames.map((game, index) => ({
        ...game,
        sort: index,
      }));

      setGames(updatedGames);

      // Update backend
      try {
        await fetch("/api/admin/games", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            games: updatedGames.map((g) => ({ id: g.id, sort: g.sort })),
          }),
        });
      } catch (error) {
        console.error("Error updating sort:", error);
        alert("เกิดข้อผิดพลาดในการอัปเดตลำดับ");
        setGames(games); // Revert
      }
    }
  };

  const handleOpenModal = (game?: Game) => {
    if (game) {
      setEditingGame(game);
      setFormData({
        name: game.name,
        icon: game.icon,
        description: game.description,
        isPlayerId: game.isPlayerId,
        playerFieldName: game.playerFieldName,
        isServer: game.isServer,
        isActive: game.isActive,
      });
    } else {
      setEditingGame(null);
      setFormData({
        name: "",
        icon: "",
        description: "",
        isPlayerId: false,
        playerFieldName: "UID",
        isServer: false,
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIcon(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const response = await fetch("/api/admin/games/upload-icon", {
        method: "POST",
        body: uploadFormData,
      });

      const data = await response.json();

      if (data.success && data.url) {
        setFormData(prev => ({ ...prev, icon: data.url }));
      } else {
        alert("ไม่สามารถอัพโหลดรูปไอคอนได้");
      }
    } catch (error) {
      console.error("Error uploading icon:", error);
      alert("เกิดข้อผิดพลาดในการอัพโหลดรูปไอคอน");
    } finally {
      setUploadingIcon(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingGame
        ? `/api/admin/games/${editingGame.id}`
        : "/api/admin/games";
      const method = editingGame ? "PUT" : "POST";

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

      alert(editingGame ? "แก้ไขเกมสำเร็จ" : "เพิ่มเกมสำเร็จ");
      setIsModalOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error saving game:", error);
      alert("เกิดข้อผิดพลาด");
    }
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    // อัปเดต UI ทันที (Optimistic Update)
    const newStatus = !currentStatus;
    setGames(games.map((g) => 
      g.id === id ? { ...g, isActive: newStatus } : g
    ));

    // ส่ง request ไป backend
    try {
      const res = await fetch(`/api/admin/games/${id}/toggle`, {
        method: "PATCH",
      });

      if (!res.ok) {
        // ถ้า error ให้ revert กลับ
        setGames(games.map((g) => 
          g.id === id ? { ...g, isActive: currentStatus } : g
        ));
        alert("เกิดข้อผิดพลาดในการเปลี่ยนสถานะ");
      }
    } catch (error) {
      // ถ้า error ให้ revert กลับ
      setGames(games.map((g) => 
        g.id === id ? { ...g, isActive: currentStatus } : g
      ));
      console.error("Error toggling game:", error);
      alert("เกิดข้อผิดพลาด");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("คุณแน่ใจว่าต้องการลบเกมนี้?")) return;

    try {
      const res = await fetch(`/api/admin/games/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("เกิดข้อผิดพลาดในการลบ");
        return;
      }

      alert("ลบเกมสำเร็จ");
      setGames(games.filter((g) => g.id !== id));
    } catch (error) {
      console.error("Error deleting game:", error);
      alert("เกิดข้อผิดพลาด");
    }
  };

  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    // Optimistic update
    const newStatus = !currentStatus;
    setGames(games.map((g) => 
      g.id === id ? { ...g, isFeatured: newStatus } : g
    ));

    try {
      const res = await fetch(`/api/admin/games/${id}/toggle-featured`, {
        method: "PATCH",
      });

      if (!res.ok) {
        // Revert on error
        setGames(games.map((g) => 
          g.id === id ? { ...g, isFeatured: currentStatus } : g
        ));
        alert("เกิดข้อผิดพลาดในการเปลี่ยนสถานะ");
      }
    } catch (error) {
      // Revert on error
      setGames(games.map((g) => 
        g.id === id ? { ...g, isFeatured: currentStatus } : g
      ));
      console.error("Error toggling featured:", error);
      alert("เกิดข้อผิดพลาด");
    }
  };

  const handleManagePackages = (gameId: string) => {
    router.push(`/admin/games-management/${gameId}/packages`);
  };

  const handleManageServers = (gameId: string) => {
    router.push(`/admin/games-management/${gameId}/servers`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Gamepad2 className="w-8 h-8 text-indigo-400" />
              จัดการเกม
            </h1>
            <p className="text-gray-400 mt-1">
              ลากเพื่อเรียงลำดับ | {games.length} เกม
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            เพิ่มเกมใหม่
          </button>
        </div>

        {/* Games List with DnD */}
        {mounted && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={games.map((g) => g.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {games.map((game) => (
                  <SortableItem
                    key={game.id}
                    game={game}
                    onEdit={handleOpenModal}
                    onDelete={handleDelete}
                    onManagePackages={handleManagePackages}
                    onManageServers={handleManageServers}
                    onToggle={handleToggle}
                    onToggleFeatured={handleToggleFeatured}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {mounted && games.length === 0 && (
          <div className="text-center py-20">
            <Gamepad2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">ยังไม่มีเกม คลิก &quot;เพิ่มเกมใหม่&quot; เพื่อเริ่มต้น</p>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-white mb-6">
                {editingGame ? "แก้ไขเกม" : "เพิ่มเกมใหม่"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    ชื่อเกม *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Icon รูปภาพ
                  </label>
                  {formData.icon && formData.icon !== "-" ? (
                    <div className="flex items-center gap-4">
                      <img
                        src={formData.icon}
                        alt="Icon preview"
                        className="w-20 h-20 object-contain rounded-lg bg-white/5 p-2"
                      />
                      <div className="flex-1">
                        <input
                          type="text"
                          value={formData.icon}
                          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-2"
                          placeholder="หรือใส่ URL โดยตรง"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => iconInputRef.current?.click()}
                            disabled={uploadingIcon}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors text-sm"
                          >
                            {uploadingIcon ? "กำลังอัพโหลด..." : "เปลี่ยนรูป"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, icon: "-" })}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                          >
                            ลบรูป
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => iconInputRef.current?.click()}
                        disabled={uploadingIcon}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                      >
                        <ImageIcon className="w-5 h-5 mr-2" />
                        {uploadingIcon ? "กำลังอัพโหลด..." : "อัพโหลดไอคอน"}
                      </button>
                      <input
                        type="text"
                        value={formData.icon}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="หรือใส่ URL ไอคอนโดยตรง"
                      />
                    </div>
                  )}
                  <input
                    ref={iconInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleIconUpload}
                    className="hidden"
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
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isPlayerId"
                      checked={formData.isPlayerId}
                      onChange={(e) => setFormData({ ...formData, isPlayerId: e.target.checked })}
                      className="w-4 h-4 rounded"
                    />
                    <label htmlFor="isPlayerId" className="text-sm text-gray-300">
                      ต้องการ Player ID
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isServer"
                      checked={formData.isServer}
                      onChange={(e) => setFormData({ ...formData, isServer: e.target.checked })}
                      className="w-4 h-4 rounded"
                    />
                    <label htmlFor="isServer" className="text-sm text-gray-300">
                      ต้องเลือก Server
                    </label>
                  </div>
                </div>

                {formData.isPlayerId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      ชื่อฟิลด์ Player ID
                    </label>
                    <input
                      type="text"
                      value={formData.playerFieldName}
                      onChange={(e) => setFormData({ ...formData, playerFieldName: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                )}

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
                    className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
                  >
                    {editingGame ? "บันทึก" : "เพิ่ม"}
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
