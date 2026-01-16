"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Server, Plus, Pencil, Trash2, X, Save, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ServerData {
  id: string;
  name: string;
  serverCode: string;
  isActive: boolean;
}

interface GameData {
  id: string;
  name: string;
  servers?: ServerData[];
}

export default function ServersManagementClient({
  initialGame,
}: {
  initialGame: GameData;
}) {
  const router = useRouter();
  const [game] = useState<GameData>(initialGame);
  const [servers, setServers] = useState<ServerData[]>(initialGame.servers || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingServer, setEditingServer] = useState<ServerData | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    serverCode: "",
    isActive: true,
  });

  const openModal = (server?: ServerData) => {
    if (server) {
      setEditingServer(server);
      setFormData({
        name: server.name,
        serverCode: server.serverCode,
        isActive: server.isActive,
      });
    } else {
      setEditingServer(null);
      setFormData({
        name: "",
        serverCode: "",
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingServer(null);
    setFormData({ name: "", serverCode: "", isActive: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = editingServer
        ? `/api/admin/games/${game.id}/servers/${editingServer.id}`
        : `/api/admin/games/${game.id}/servers`;
      const method = editingServer ? "PUT" : "POST";
      const payload = JSON.stringify(formData);

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
        credentials: 'include',
      });

      // จัดการกับ 401/403 โดยเฉพาะ
      if (response.status === 401 || response.status === 403) {
        alert("Session หมดอายุ กรุณา Login ใหม่");
        window.location.href = "/";
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "เกิดข้อผิดพลาด");
        setIsLoading(false);
        return;
      }

      if (editingServer) {
        setServers(
          servers.map((s) =>
            s.id === editingServer.id ? data.server : s
          )
        );
      } else {
        setServers([...servers, data.server]);
      }

      closeModal();
    } catch (error) {
      console.error("Error:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (server: ServerData) => {
    if (!confirm(`คุณต้องการลบ ${server.name} ใช่หรือไม่?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/games/${game.id}/servers/${server.id}`, {
        method: "DELETE",
        credentials: 'include',
      });

      // จัดการกับ 401/403 โดยเฉพาะ
      if (response.status === 401 || response.status === 403) {
        alert("Session หมดอายุ กรุณา Login ใหม่");
        window.location.href = "/";
        return;
      }

      if (!response.ok) {
        alert("เกิดข้อผิดพลาด");
        return;
      }

      setServers(servers.filter((s) => s.id !== server.id));
    } catch (error) {
      console.error("Error:", error);
      alert("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <Link
              href={`/admin/games-management`}
              className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-3 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              กลับไปหน้าจัดการเกม
            </Link>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 text-emerald-300">
                <Server className="w-6 h-6" />
              </span>
              จัดการ Servers - {game.name}
            </h1>
            <p className="text-gray-400 mt-1 text-sm">
              จัดการเซิร์ฟเวอร์ที่ใช้สำหรับส่ง serverCode ไปยัง WePay (pay_to_ref2)
            </p>
          </div>
          <button
            onClick={() => openModal()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold hover:from-emerald-600 hover:to-cyan-600 transition-all shadow-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            เพิ่ม Server
          </button>
        </div>

        {/* Servers List */}
        <div className="bg-slate-900/80 border border-white/10 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-800">
              <thead className="bg-slate-900/80">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    ชื่อ Server
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Server Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    สถานะ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-slate-900/60 divide-y divide-slate-800">
                {servers.length > 0 ? (
                  servers.map((server) => (
                    <tr key={server.id} className="hover:bg-slate-800/80 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800 text-emerald-300 mr-3">
                            <Server className="w-4 h-4" />
                          </span>
                          <span className="text-sm font-medium text-white">
                            {server.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-emerald-300 font-mono bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                          {server.serverCode}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            server.isActive
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                              : "bg-red-500/20 text-red-300 border border-red-500/40"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${server.isActive ? "bg-emerald-300" : "bg-red-300"}`} />
                          {server.isActive ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openModal(server)}
                          className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-sky-500/15 text-sky-300 hover:bg-sky-500/25 transition-colors mr-2 border border-sky-500/30"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(server)}
                          className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-red-500/15 text-red-300 hover:bg-red-500/25 transition-colors border border-red-500/30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-16 text-center text-sm text-gray-400"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-800 text-slate-400 mb-3">
                          <Server className="w-7 h-7" />
                        </span>
                        <p className="text-gray-300 mb-1">ยังไม่มี Server สำหรับเกมนี้</p>
                        <p className="text-xs text-gray-500">
                          คลิกปุ่ม &quot;เพิ่ม Server&quot; ด้านขวาบนเพื่อเพิ่ม Server ใหม่
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl max-w-md w-full border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300">
                  <Server className="w-4 h-4" />
                </span>
                {editingServer ? "แก้ไข Server" : "เพิ่ม Server"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  ชื่อ Server
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="เช่น Asia, Europe, America"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Server Code (สำหรับ WePay)
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={formData.serverCode}
                  onChange={(e) =>
                    setFormData({ ...formData, serverCode: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-emerald-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono text-sm"
                  placeholder="เช่น ASIA01, EU01"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  รหัสนี้จะถูกส่งไปยัง WePay ในฟิลด์ <span className="font-mono text-emerald-300">pay_to_ref2</span>
                </p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4 text-emerald-500 bg-slate-800 border-slate-600 rounded focus:ring-emerald-500"
                />
                <label
                  htmlFor="isActive"
                  className="ml-2 text-sm text-gray-200"
                >
                  เปิดใช้งาน Server นี้
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg border border-white/10 text-gray-200 bg-white/5 hover:bg-white/10 transition-colors text-sm flex items-center gap-1"
                  disabled={isLoading}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium hover:from-emerald-600 hover:to-cyan-600 transition-all flex items-center gap-2 text-sm disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>กำลังบันทึก...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>บันทึก</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
