"use client";

import { useState, useEffect } from "react";
import { X, Loader2, User, Phone, Building2, CreditCard, CheckCircle } from "lucide-react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const BANK_OPTIONS = [
  "ธนาคารกสิกรไทย",
  "ธนาคารกรุงเทพ",
  "ธนาคารไทยพาณิชย์",
  "ธนาคารกรุงไทย",
  "ธนาคารกรุงศรีอยุธยา",
  "ธนาคารทหารไทยธนชาต",
  "ธนาคารออมสิน",
  "ธนาคารเกียรตินาคินภัทร",
  "ธนาคารซีไอเอ็มบี ไทย",
  "ธนาคารยูโอบี",
  "ธนาคารแลนด์ แอนด์ เฮ้าส์",
  "อื่นๆ",
];

export default function ProfileModal({ isOpen, onClose, onComplete }: ProfileModalProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccountReceive, setBankAccountReceive] = useState("");
  const [bankAccountTransfer, setBankAccountTransfer] = useState("");
  const [otherBankName, setOtherBankName] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchProfile();
    }
  }, [isOpen]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/profile");
      const data = await res.json();
      if (data.success && data.user) {
        setFullName(data.user.fullName || "");
        setPhone(data.user.phone || "");
        setEmail(data.user.email || "");
        setBankName(data.user.bankName || "");
        setBankAccountReceive(data.user.bankAccountReceive || "");
        setBankAccountTransfer(data.user.bankAccountTransfer || "");
        setOtherBankName(data.user.otherBankName || "");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName.trim()) {
      setResult({ success: false, message: "กรุณากรอกชื่อ-นามสกุล" });
      return;
    }
    if (!phone.trim()) {
      setResult({ success: false, message: "กรุณากรอกเบอร์โทรศัพท์" });
      return;
    }

    setSaving(true);
    setResult(null);

    try {
      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim(),
          bankName: bankName === "อื่นๆ" ? "" : bankName,
          bankAccountReceive: bankAccountReceive.trim(),
          bankAccountTransfer: bankAccountTransfer.trim(),
          otherBankName: bankName === "อื่นๆ" ? otherBankName.trim() : "",
        }),
      });

      const data = await res.json();

      if (data.success) {
        setResult({ success: true, message: "บันทึกข้อมูลสำเร็จ!" });
        setTimeout(() => {
          onComplete();
        }, 1500);
      } else {
        setResult({ success: false, message: data.error || "เกิดข้อผิดพลาด" });
      }
    } catch {
      setResult({ success: false, message: "เกิดข้อผิดพลาด" });
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">กรอกข้อมูลส่วนตัว</h2>
              <p className="text-sm text-gray-400 mt-1">กรุณากรอกข้อมูลเพื่อใช้งานระบบ</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  ชื่อ-นามสกุล <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="ชื่อ นามสกุล"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  เบอร์โทรศัพท์ <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0xx-xxx-xxxx"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Email (readonly) */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  อีเมล
                </label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 cursor-not-allowed"
                />
              </div>

              {/* Bank Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Building2 className="w-4 h-4 inline mr-1" />
                  ธนาคาร
                </label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="" className="bg-slate-800">-- เลือกธนาคาร --</option>
                  {BANK_OPTIONS.map((bank) => (
                    <option key={bank} value={bank} className="bg-slate-800">{bank}</option>
                  ))}
                </select>
              </div>

              {/* Other Bank Name */}
              {bankName === "อื่นๆ" && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    ระบุชื่อธนาคาร
                  </label>
                  <input
                    type="text"
                    value={otherBankName}
                    onChange={(e) => setOtherBankName(e.target.value)}
                    placeholder="ชื่อธนาคาร"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              {/* Bank Account Receive */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <CreditCard className="w-4 h-4 inline mr-1" />
                  เลขบัญชีรับเงิน
                </label>
                <input
                  type="text"
                  value={bankAccountReceive}
                  onChange={(e) => setBankAccountReceive(e.target.value)}
                  placeholder="xxx-x-xxxxx-x"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Bank Account Transfer */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <CreditCard className="w-4 h-4 inline mr-1" />
                  เลขบัญชีโอนเงิน
                </label>
                <input
                  type="text"
                  value={bankAccountTransfer}
                  onChange={(e) => setBankAccountTransfer(e.target.value)}
                  placeholder="xxx-x-xxxxx-x"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

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
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors"
                >
                  ข้าม
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      กำลังบันทึก...
                    </>
                  ) : (
                    "บันทึกข้อมูล"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
