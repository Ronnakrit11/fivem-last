"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Bot, Save, Loader2, Send, CheckCircle, XCircle } from "lucide-react";

export default function TelegramSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [formData, setFormData] = useState({
    botToken: "",
    chatId: "",
    isActive: true,
  });

  useEffect(() => {
    fetch("/api/admin/telegram-config")
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
        if (data?.config) {
          setFormData({
            botToken: data.config.botToken || "",
            chatId: data.config.chatId || "",
            isActive: data.config.isActive ?? true,
          });
        }
      })
      .catch(err => {
        console.error("Error fetching config:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/telegram-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        alert("บันทึกการตั้งค่าสำเร็จ");
      } else {
        alert(data.error || "เกิดข้อผิดพลาด");
      }
    } catch {
      alert("เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    if (!formData.botToken || !formData.chatId) {
      alert("กรุณากรอก Bot Token และ Chat ID ก่อนทดสอบ");
      return;
    }

    setTesting(true);
    setTestResult(null);
    try {
      const url = `https://api.telegram.org/bot${formData.botToken}/sendMessage`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: formData.chatId,
          text: "✅ ทดสอบการแจ้งเตือนจากระบบสำเร็จ!\n\nระบบแจ้งเตือน Telegram ทำงานปกติ",
          parse_mode: "HTML",
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setTestResult({ success: true, message: "ส่งข้อความทดสอบสำเร็จ! ตรวจสอบใน Telegram ของคุณ" });
      } else {
        setTestResult({ success: false, message: data.description || "ไม่สามารถส่งข้อความได้ ตรวจสอบ Bot Token และ Chat ID" });
      }
    } catch {
      setTestResult({ success: false, message: "เกิดข้อผิดพลาดในการเชื่อมต่อ" });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            กลับไปหน้าจัดการ
          </Link>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <Bot className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                ตั้งค่าแจ้งเตือน Telegram
              </h1>
              <p className="text-gray-600">
                ตั้งค่า Bot Token และ Chat ID เพื่อรับแจ้งเตือนคำสั่งซื้อผ่าน Telegram
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3" />
              <div className="h-10 bg-gray-200 rounded animate-pulse" />
              <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3" />
              <div className="h-10 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Config Form */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">การตั้งค่า Bot</h2>

              <div className="space-y-5">
                {/* Bot Token */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bot Token
                  </label>
                  <input
                    type="text"
                    value={formData.botToken}
                    onChange={(e) => setFormData({ ...formData, botToken: e.target.value })}
                    placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-mono"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    สร้าง Bot ได้ที่ @BotFather บน Telegram แล้วคัดลอก Token มาวาง
                  </p>
                </div>

                {/* Chat ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chat ID (Room ID)
                  </label>
                  <input
                    type="text"
                    value={formData.chatId}
                    onChange={(e) => setFormData({ ...formData, chatId: e.target.value })}
                    placeholder="-1001234567890"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-mono"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Chat ID ของกลุ่มหรือแชทที่ต้องการรับแจ้งเตือน (ใช้ @userinfobot หรือ @getidsbot เพื่อดู ID)
                  </p>
                </div>

                {/* Active Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">เปิดใช้งานการแจ้งเตือน</p>
                    <p className="text-sm text-gray-500">เมื่อเปิด ระบบจะส่งแจ้งเตือนทุกครั้งที่มีคำสั่งซื้อ</p>
                  </div>
                  <button
                    onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.isActive ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.isActive ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  บันทึกการตั้งค่า
                </button>
              </div>
            </div>

            {/* Test Section */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">ทดสอบการแจ้งเตือน</h2>
              <p className="text-sm text-gray-600 mb-4">
                กดปุ่มด้านล่างเพื่อส่งข้อความทดสอบไปยัง Telegram ของคุณ (ต้องบันทึกการตั้งค่าก่อน)
              </p>

              <button
                onClick={handleTest}
                disabled={testing || !formData.botToken || !formData.chatId}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                ส่งข้อความทดสอบ
              </button>

              {testResult && (
                <div className={`mt-4 p-4 rounded-lg flex items-start gap-3 ${
                  testResult.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                }`}>
                  {testResult.success ? (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <p className={`text-sm ${testResult.success ? "text-green-700" : "text-red-700"}`}>
                    {testResult.message}
                  </p>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">วิธีตั้งค่า</h2>
              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex gap-3">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                  <p>เปิด Telegram แล้วค้นหา <span className="font-mono bg-gray-100 px-1 rounded">@BotFather</span></p>
                </div>
                <div className="flex gap-3">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                  <p>พิมพ์ <span className="font-mono bg-gray-100 px-1 rounded">/newbot</span> แล้วตั้งชื่อ Bot ตามต้องการ</p>
                </div>
                <div className="flex gap-3">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                  <p>คัดลอก <strong>Bot Token</strong> ที่ได้มาวางในช่องด้านบน</p>
                </div>
                <div className="flex gap-3">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                  <p>เพิ่ม Bot เข้ากลุ่ม Telegram ที่ต้องการรับแจ้งเตือน</p>
                </div>
                <div className="flex gap-3">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">5</span>
                  <p>ค้นหา <span className="font-mono bg-gray-100 px-1 rounded">@getidsbot</span> หรือ <span className="font-mono bg-gray-100 px-1 rounded">@userinfobot</span> เพื่อดู Chat ID ของกลุ่ม แล้ววางในช่อง Chat ID</p>
                </div>
                <div className="flex gap-3">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">6</span>
                  <p>กดบันทึก แล้วทดสอบส่งข้อความ</p>
                </div>
              </div>
            </div>

            {/* Notification Types */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">การแจ้งเตือนที่จะได้รับ</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <span className="text-lg">🛒</span>
                  <p className="text-sm text-gray-700">คำสั่งซื้อสินค้าไอเทมเกมใหม่</p>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <span className="text-lg">🎮</span>
                  <p className="text-sm text-gray-700">การซื้อสินค้าผ่านระบบ (เติมเกม/บัตร)</p>
                </div>
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                  <span className="text-lg">📦</span>
                  <p className="text-sm text-gray-700">รายการขายจาก User ใหม่</p>
                </div>
                <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                  <span className="text-lg">🔨</span>
                  <p className="text-sm text-gray-700">การประมูลใหม่</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
