"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, Loader2, Save, ShoppingCart, UserPlus, Tag } from "lucide-react";
import Link from "next/link";

interface Policy {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type TabType = "register" | "purchase" | "sell";

export default function PolicyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("register");
  
  // Register policy state
  const [registerPolicy, setRegisterPolicy] = useState<Policy | null>(null);
  const [registerFormData, setRegisterFormData] = useState({
    id: "",
    title: "นโยบายความเป็นส่วนตัว",
    content: "",
    isActive: true,
  });

  // Purchase policy state
  const [purchasePolicy, setPurchasePolicy] = useState<Policy | null>(null);
  const [purchaseFormData, setPurchaseFormData] = useState({
    id: "",
    title: "นโยบายการซื้อสินค้า",
    content: "",
    isActive: true,
  });

  // Sell policy state
  const [sellPolicy, setSellPolicy] = useState<Policy | null>(null);
  const [sellFormData, setSellFormData] = useState({
    id: "",
    title: "นโยบายการขายสินค้า",
    content: "",
    isActive: true,
  });

  const fetchPolicies = async () => {
    setLoading(true);
    try {
      // Fetch register policy
      const registerRes = await fetch("/api/admin/policy");
      if (registerRes.status === 401) {
        router.push("/auth");
        return;
      }
      if (registerRes.status === 403) {
        router.push("/dashboard");
        return;
      }
      const registerData = await registerRes.json();
      if (registerData && registerData.policies && registerData.policies.length > 0) {
        const p = registerData.policies[0];
        setRegisterPolicy(p);
        setRegisterFormData({
          id: p.id,
          title: p.title,
          content: p.content,
          isActive: p.isActive,
        });
      }

      // Fetch purchase policy
      const purchaseRes = await fetch("/api/admin/purchase-policy");
      const purchaseData = await purchaseRes.json();
      if (purchaseData && purchaseData.policies && purchaseData.policies.length > 0) {
        const p = purchaseData.policies[0];
        setPurchasePolicy(p);
        setPurchaseFormData({
          id: p.id,
          title: p.title,
          content: p.content,
          isActive: p.isActive,
        });
      }

      // Fetch sell policy
      const sellRes = await fetch("/api/admin/sell-policy");
      const sellData = await sellRes.json();
      if (sellData && sellData.policies && sellData.policies.length > 0) {
        const p = sellData.policies[0];
        setSellPolicy(p);
        setSellFormData({
          id: p.id,
          title: p.title,
          content: p.content,
          isActive: p.isActive,
        });
      }
    } catch (err) {
      console.error("Error fetching policies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, [router]);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/admin/policy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerFormData),
      });

      const data = await res.json();
      if (data.success) {
        alert(data.message);
        if (data.policy) {
          setRegisterPolicy(data.policy);
          setRegisterFormData(prev => ({ ...prev, id: data.policy.id }));
        }
      } else {
        alert(data.error || "เกิดข้อผิดพลาด");
      }
    } catch {
      alert("เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  };

  const handlePurchaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/admin/purchase-policy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(purchaseFormData),
      });

      const data = await res.json();
      if (data.success) {
        alert(data.message);
        if (data.policy) {
          setPurchasePolicy(data.policy);
          setPurchaseFormData(prev => ({ ...prev, id: data.policy.id }));
        }
      } else {
        alert(data.error || "เกิดข้อผิดพลาด");
      }
    } catch {
      alert("เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  };

  const handleSellSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/admin/sell-policy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sellFormData),
      });

      const data = await res.json();
      if (data.success) {
        alert(data.message);
        if (data.policy) {
          setSellPolicy(data.policy);
          setSellFormData(prev => ({ ...prev, id: data.policy.id }));
        }
      } else {
        alert(data.error || "เกิดข้อผิดพลาด");
      }
    } catch {
      alert("เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
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
          <div className="flex items-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                จัดการนโยบาย
              </h1>
              <p className="text-gray-600">
                ตั้งค่านโยบายสำหรับสมัครสมาชิก, การซื้อ และการขายสินค้า
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("register")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "register"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            นโยบายสมัครสมาชิก
          </button>
          <button
            onClick={() => setActiveTab("purchase")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "purchase"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            นโยบายการซื้อสินค้า
          </button>
          <button
            onClick={() => setActiveTab("sell")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "sell"
                ? "bg-orange-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            <Tag className="w-4 h-4" />
            นโยบายการขายสินค้า
          </button>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
          ) : activeTab === "register" ? (
            <form onSubmit={handleRegisterSubmit} className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  หัวข้อนโยบาย
                </label>
                <input
                  type="text"
                  value={registerFormData.title}
                  onChange={(e) => setRegisterFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="เช่น นโยบายความเป็นส่วนตัว, ข้อตกลงการใช้งาน"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  เนื้อหานโยบาย *
                </label>
                <textarea
                  value={registerFormData.content}
                  onChange={(e) => setRegisterFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[300px] font-mono text-sm"
                  placeholder="ใส่เนื้อหานโยบายที่นี่... (รองรับ HTML)"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  สามารถใช้ HTML ได้ เช่น &lt;b&gt;ตัวหนา&lt;/b&gt;, &lt;br&gt; ขึ้นบรรทัดใหม่
                </p>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="registerIsActive"
                  checked={registerFormData.isActive}
                  onChange={(e) => setRegisterFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <label htmlFor="registerIsActive" className="text-sm text-gray-700">
                  เปิดใช้งานนโยบายนี้ (แสดงตอนสมัครสมาชิก)
                </label>
              </div>

              {/* Info */}
              {registerPolicy && (
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                  <p>อัปเดตล่าสุด: {new Date(registerPolicy.updatedAt).toLocaleString("th-TH")}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={saving}
                className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    กำลังบันทึก...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    บันทึกนโยบายสมัครสมาชิก
                  </>
                )}
              </button>
            </form>
          ) : activeTab === "purchase" ? (
            <form onSubmit={handlePurchaseSubmit} className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  หัวข้อนโยบาย
                </label>
                <input
                  type="text"
                  value={purchaseFormData.title}
                  onChange={(e) => setPurchaseFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="เช่น นโยบายการซื้อสินค้า, ข้อตกลงการชำระเงิน"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  เนื้อหานโยบาย *
                </label>
                <textarea
                  value={purchaseFormData.content}
                  onChange={(e) => setPurchaseFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent min-h-[300px] font-mono text-sm"
                  placeholder="ใส่เนื้อหานโยบายการซื้อสินค้าที่นี่... (รองรับ HTML)"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  นโยบายนี้จะแสดงในหน้ายืนยันการชำระเงิน
                </p>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="purchaseIsActive"
                  checked={purchaseFormData.isActive}
                  onChange={(e) => setPurchaseFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <label htmlFor="purchaseIsActive" className="text-sm text-gray-700">
                  เปิดใช้งานนโยบายนี้ (แสดงตอนซื้อสินค้า)
                </label>
              </div>

              {/* Info */}
              {purchasePolicy && (
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                  <p>อัปเดตล่าสุด: {new Date(purchasePolicy.updatedAt).toLocaleString("th-TH")}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={saving}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    กำลังบันทึก...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    บันทึกนโยบายการซื้อสินค้า
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSellSubmit} className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  หัวข้อนโยบาย
                </label>
                <input
                  type="text"
                  value={sellFormData.title}
                  onChange={(e) => setSellFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="เช่น นโยบายการขายสินค้า, ข้อตกลงการขาย"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  เนื้อหานโยบาย *
                </label>
                <textarea
                  value={sellFormData.content}
                  onChange={(e) => setSellFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent min-h-[300px] font-mono text-sm"
                  placeholder="ใส่เนื้อหานโยบายการขายสินค้าที่นี่... (รองรับ HTML)"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  นโยบายนี้จะแสดงในหน้าขายสินค้าให้เรา
                </p>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="sellIsActive"
                  checked={sellFormData.isActive}
                  onChange={(e) => setSellFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                />
                <label htmlFor="sellIsActive" className="text-sm text-gray-700">
                  เปิดใช้งานนโยบายนี้ (แสดงตอนขายสินค้า)
                </label>
              </div>

              {/* Info */}
              {sellPolicy && (
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                  <p>อัปเดตล่าสุด: {new Date(sellPolicy.updatedAt).toLocaleString("th-TH")}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={saving}
                className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    กำลังบันทึก...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    บันทึกนโยบายการขายสินค้า
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
