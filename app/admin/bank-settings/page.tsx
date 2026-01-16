"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Building2, Plus, Pencil, Trash2, X, Loader2, Check, Upload, QrCode, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  qrCodeUrl: string | null;
  isActive: boolean;
  sortOrder: number;
}

const THAI_BANKS = [
  "ธนาคารกรุงเทพ",
  "ธนาคารกสิกรไทย",
  "ธนาคารกรุงไทย",
  "ธนาคารไทยพาณิชย์",
  "ธนาคารกรุงศรีอยุธยา",
  "ธนาคารทหารไทยธนชาต",
  "ธนาคารออมสิน",
  "ธนาคารเกียรตินาคินภัทร",
  "ธนาคารซีไอเอ็มบี ไทย",
  "ธนาคารยูโอบี",
  "ธนาคารแลนด์ แอนด์ เฮ้าส์",
  "ธนาคารไอซีบีซี (ไทย)",
  "ธนาคารทิสโก้",
  "PromptPay",
  "TrueMoney Wallet",
  "อื่นๆ",
];

export default function BankSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    bankName: "",
    accountNumber: "",
    accountName: "",
    qrCodeUrl: "",
    isActive: true,
  });
  const [uploadingQr, setUploadingQr] = useState(false);

  const fetchAccounts = async () => {
    try {
      const res = await fetch("/api/admin/bank-accounts");
      if (res.status === 401) {
        router.push("/auth");
        return;
      }
      if (res.status === 403) {
        router.push("/dashboard");
        return;
      }
      const data = await res.json();
      if (data.success) {
        setAccounts(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching bank accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [router]);

  const openAddModal = () => {
    setEditingAccount(null);
    setFormData({
      bankName: "",
      accountNumber: "",
      accountName: "",
      qrCodeUrl: "",
      isActive: true,
    });
    setShowModal(true);
  };

  const openEditModal = (account: BankAccount) => {
    setEditingAccount(account);
    setFormData({
      bankName: account.bankName,
      accountNumber: account.accountNumber,
      accountName: account.accountName,
      qrCodeUrl: account.qrCodeUrl || "",
      isActive: account.isActive,
    });
    setShowModal(true);
  };

  const handleQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingQr(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const res = await fetch("/api/upload-slip", {
        method: "POST",
        body: formDataUpload,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setFormData({ ...formData, qrCodeUrl: data.url });
      } else {
        alert(data.error || "ไม่สามารถอัพโหลดรูป QR Code ได้");
      }
    } catch (error) {
      console.error("Error uploading QR code:", error);
      alert("เกิดข้อผิดพลาดในการอัพโหลด QR Code");
    } finally {
      setUploadingQr(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.bankName || !formData.accountNumber || !formData.accountName) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    setSubmitting(true);
    try {
      const url = editingAccount
        ? `/api/admin/bank-accounts/${editingAccount.id}`
        : "/api/admin/bank-accounts";
      const method = editingAccount ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        fetchAccounts();
      } else {
        alert(data.error || "เกิดข้อผิดพลาด");
      }
    } catch (error) {
      console.error("Error saving bank account:", error);
      alert("เกิดข้อผิดพลาด");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ต้องการลบบัญชีธนาคารนี้หรือไม่?")) return;

    try {
      const res = await fetch(`/api/admin/bank-accounts/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        fetchAccounts();
      } else {
        alert(data.error || "เกิดข้อผิดพลาด");
      }
    } catch (error) {
      console.error("Error deleting bank account:", error);
      alert("เกิดข้อผิดพลาด");
    }
  };

  const toggleActive = async (account: BankAccount) => {
    try {
      const res = await fetch(`/api/admin/bank-accounts/${account.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !account.isActive }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAccounts();
      }
    } catch (error) {
      console.error("Error toggling bank account:", error);
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
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                <Building2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  ตั้งค่าบัญชีธนาคาร
                </h1>
                <p className="text-gray-600 text-sm">
                  จัดการบัญชีธนาคารสำหรับรับชำระเงิน
                </p>
              </div>
            </div>
            <button
              onClick={openAddModal}
              className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มบัญชี
            </button>
          </div>
        </div>

        {/* Bank Accounts List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto" />
            </div>
          ) : accounts.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className={`p-4 flex items-center justify-between ${
                    !account.isActive ? "bg-gray-50" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      account.isActive ? "bg-emerald-100" : "bg-gray-200"
                    }`}>
                      <Building2 className={`w-6 h-6 ${
                        account.isActive ? "text-emerald-600" : "text-gray-400"
                      }`} />
                    </div>
                    <div>
                      <p className={`font-semibold ${
                        account.isActive ? "text-gray-900" : "text-gray-500"
                      }`}>
                        {account.bankName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {account.accountNumber} - {account.accountName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleActive(account)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        account.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {account.isActive ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                    </button>
                    <button
                      onClick={() => openEditModal(account)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(account.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">ยังไม่มีบัญชีธนาคาร</p>
              <button
                onClick={openAddModal}
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                + เพิ่มบัญชีธนาคารแรก
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingAccount ? "แก้ไขบัญชีธนาคาร" : "เพิ่มบัญชีธนาคาร"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ธนาคาร <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.bankName}
                    onChange={(e) =>
                      setFormData({ ...formData, bankName: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">เลือกธนาคาร</option>
                    {THAI_BANKS.map((bank) => (
                      <option key={bank} value={bank}>
                        {bank}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    เลขบัญชี <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, accountNumber: e.target.value })
                    }
                    placeholder="xxx-x-xxxxx-x"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ชื่อบัญชี <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.accountName}
                    onChange={(e) =>
                      setFormData({ ...formData, accountName: e.target.value })
                    }
                    placeholder="ชื่อ-นามสกุล"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    รูป QR Code
                  </label>
                  {formData.qrCodeUrl ? (
                    <div className="relative">
                      <img
                        src={formData.qrCodeUrl}
                        alt="QR Code"
                        className="w-full h-40 object-contain rounded-lg border border-gray-200 bg-gray-50"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, qrCodeUrl: "" })}
                        className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-emerald-500 transition-colors bg-gray-50">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleQrUpload}
                        className="hidden"
                        disabled={uploadingQr}
                      />
                      {uploadingQr ? (
                        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                      ) : (
                        <>
                          <QrCode className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">คลิกเพื่ออัพโหลด QR Code</p>
                        </>
                      )}
                    </label>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700">
                    เปิดใช้งาน
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    disabled={submitting}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    {editingAccount ? "บันทึก" : "เพิ่มบัญชี"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
