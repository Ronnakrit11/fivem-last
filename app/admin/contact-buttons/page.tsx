"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MessageCircle, Plus, Pencil, Trash2, Loader2, X, Upload, QrCode, Link as LinkIcon, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

interface ContactButton {
  id: string;
  name: string;
  link: string;
  icon: string | null;
  qrCodeUrl: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
}

export default function ContactButtonsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [buttons, setButtons] = useState<ContactButton[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingButton, setEditingButton] = useState<ContactButton | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingQr, setUploadingQr] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    link: "",
    icon: "",
    qrCodeUrl: "",
    isActive: true,
    sortOrder: 0,
  });

  const fetchButtons = () => {
    fetch("/api/admin/contact-buttons")
      .then(res => {
        if (res.status === 401) {
          router.push("/auth");
          return null;
        }
        if (res.status === 403) {
          router.push("/dashboard");
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          setButtons(data.buttons || []);
        }
      })
      .catch(err => {
        console.error("Error fetching buttons:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchButtons();
  }, [router]);

  const openCreateModal = () => {
    setEditingButton(null);
    setFormData({
      name: "",
      link: "",
      icon: "",
      qrCodeUrl: "",
      isActive: true,
      sortOrder: buttons.length,
    });
    setShowModal(true);
  };

  const openEditModal = (button: ContactButton) => {
    setEditingButton(button);
    setFormData({
      name: button.name,
      link: button.link,
      icon: button.icon || "",
      qrCodeUrl: button.qrCodeUrl || "",
      isActive: button.isActive,
      sortOrder: button.sortOrder,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingButton
        ? `/api/admin/contact-buttons/${editingButton.id}`
        : "/api/admin/contact-buttons";
      const method = editingButton ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        alert(data.message);
        setShowModal(false);
        fetchButtons();
      } else {
        alert(data.error || "เกิดข้อผิดพลาด");
      }
    } catch {
      alert("เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ต้องการลบปุ่มนี้หรือไม่?")) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/contact-buttons/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        fetchButtons();
      } else {
        alert(data.error || "เกิดข้อผิดพลาด");
      }
    } catch {
      alert("เกิดข้อผิดพลาด");
    } finally {
      setDeleting(null);
    }
  };

  const toggleActive = async (button: ContactButton) => {
    try {
      const res = await fetch(`/api/admin/contact-buttons/${button.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !button.isActive }),
      });
      const data = await res.json();
      if (data.success) {
        setButtons(prev => prev.map(b => b.id === button.id ? { ...b, isActive: !b.isActive } : b));
      }
    } catch {
      alert("เกิดข้อผิดพลาด");
    }
  };

  const handleUploadIcon = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });
      const data = await res.json();
      if (data.url) {
        setFormData(prev => ({ ...prev, icon: data.url }));
      } else {
        alert("อัปโหลดไม่สำเร็จ");
      }
    } catch {
      alert("เกิดข้อผิดพลาดในการอัปโหลด");
    } finally {
      setUploading(false);
    }
  };

  const handleUploadQrCode = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingQr(true);
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });
      const data = await res.json();
      if (data.url) {
        setFormData(prev => ({ ...prev, qrCodeUrl: data.url }));
      } else {
        alert("อัปโหลดไม่สำเร็จ");
      }
    } catch {
      alert("เกิดข้อผิดพลาดในการอัปโหลด");
    } finally {
      setUploadingQr(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <MessageCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  จัดการปุ่มติดต่อ
                </h1>
                <p className="text-gray-600">
                  ตั้งค่าปุ่มติดต่อที่แสดงบนหน้าเว็บ
                </p>
              </div>
            </div>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors shadow-md"
            >
              <Plus className="w-5 h-5" />
              เพิ่มปุ่ม
            </button>
          </div>
        </div>

        {/* Buttons List */}
        <div className="space-y-4">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3 mb-2" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
              </div>
            ))
          ) : buttons.length > 0 ? (
            buttons.map((button) => (
              <div
                key={button.id}
                className={`bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden ${!button.isActive ? 'opacity-60' : ''}`}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Icon Preview */}
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center overflow-hidden shadow-lg">
                        {button.icon ? (
                          <img src={button.icon} alt={button.name} className="w-full h-full object-cover" />
                        ) : (
                          <MessageCircle className="w-6 h-6 text-white" />
                        )}
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900">{button.name}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <LinkIcon className="w-3 h-3" />
                          {button.link || "ไม่มีลิงก์"}
                        </p>
                        {button.qrCodeUrl && (
                          <p className="text-xs text-purple-600 flex items-center gap-1 mt-1">
                            <QrCode className="w-3 h-3" />
                            มี QR Code
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleActive(button)}
                        className={`p-2 rounded-lg transition-colors ${button.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                        title={button.isActive ? "ซ่อนปุ่ม" : "แสดงปุ่ม"}
                      >
                        {button.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => openEditModal(button)}
                        className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(button.id)}
                        disabled={deleting === button.id}
                        className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                      >
                        {deleting === button.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-md p-12 border border-gray-200 text-center">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">ยังไม่มีปุ่มติดต่อ</p>
              <button
                onClick={openCreateModal}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
              >
                เพิ่มปุ่มแรก
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <form onSubmit={handleSubmit} className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingButton ? "แก้ไขปุ่มติดต่อ" : "เพิ่มปุ่มติดต่อ"}
                </h2>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ชื่อปุ่ม *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="เช่น ติดต่อเรา, Line Official"
                    required
                  />
                </div>

                {/* Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ลิงก์
                  </label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://lin.ee/xxxxx"
                  />
                </div>

                {/* Icon Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    รูปไอคอน
                  </label>
                  <div className="flex items-center gap-4">
                    {formData.icon ? (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center overflow-hidden shadow-lg">
                        <img src={formData.icon} alt="Icon" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-lg">
                        <MessageCircle className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        {uploading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                        อัปโหลดรูป
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleUploadIcon}
                          className="hidden"
                          disabled={uploading}
                        />
                      </label>
                      {formData.icon && (
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, icon: "" }))}
                          className="ml-2 text-sm text-red-600 hover:text-red-700"
                        >
                          ลบรูป
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* QR Code Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    QR Code (แสดงเมื่อกดปุ่ม)
                  </label>
                  <div className="flex items-start gap-4">
                    {formData.qrCodeUrl ? (
                      <div className="w-24 h-24 rounded-lg border border-gray-200 overflow-hidden">
                        <img src={formData.qrCodeUrl} alt="QR Code" className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <QrCode className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        {uploadingQr ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                        อัปโหลด QR Code
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleUploadQrCode}
                          className="hidden"
                          disabled={uploadingQr}
                        />
                      </label>
                      {formData.qrCodeUrl && (
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, qrCodeUrl: "" }))}
                          className="ml-2 text-sm text-red-600 hover:text-red-700"
                        >
                          ลบ QR
                        </button>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        ถ้ามี QR Code จะแสดง popup เมื่อกดปุ่ม แทนการเปิดลิงก์
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sort Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ลำดับการแสดง
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="0"
                  />
                </div>

                {/* Active Toggle */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700">
                    เปิดใช้งานปุ่มนี้
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      กำลังบันทึก...
                    </>
                  ) : (
                    editingButton ? "บันทึกการแก้ไข" : "สร้างปุ่ม"
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
