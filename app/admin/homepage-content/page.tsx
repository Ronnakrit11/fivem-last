"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  LayoutGrid,
  Shield,
  Globe,
  Sparkles,
  RotateCcw,
  Save,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  GripVertical,
  ChevronRight,
  Type,
} from "lucide-react";
import TiptapEditor from "./TiptapEditor";

interface SectionConfig {
  title: string;
  subtitle: string;
  visible: boolean;
  glowColor?: string;
  titleColor?: string;
  cardBgColor?: string;
  cardTextColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
}

interface TrustBarItem {
  title: string;
  desc: string;
  icon: string;
  visible: boolean;
}

interface FooterConfig {
  title: string;
  description: string;
  links: { label: string; href: string }[];
  visible: boolean;
}

interface CustomSection {
  id: string;
  title: string;
  subtitle: string;
  position: string;
  icon: string;
  glowColor: string;
  sort: number;
  visible: boolean;
  content: string;
}

type TabType = "sections" | "trustbar" | "footer" | "custom";

const SECTION_LABELS: Record<string, string> = {
  games: "เกม",
  cards: "บัตรเติมเงิน",
  realProducts: "สินค้าบริษัท",
  products: "สินค้าของเรา",
  auction: "สินค้าประมูล",
  recentOrders: "คำสั่งซื้อล่าสุด",
  sellItems: "ขายสินค้า",
  articles: "บทความ",
};

const ICON_OPTIONS = [
  "Sun", "Star", "Heart", "Shield", "Zap", "Award", "Gift", "Crown",
  "Gamepad2", "CreditCard", "Package", "ShoppingBag", "Sparkles", "Globe",
  "Lock", "Clock", "Bell", "Bookmark", "Camera", "Coffee",
];

const POSITION_OPTIONS = [
  { value: "before_games", label: "ก่อน เกม" },
  { value: "after_games", label: "หลัง เกม" },
  { value: "after_cards", label: "หลัง บัตรเติมเงิน" },
  { value: "after_realProducts", label: "หลัง สินค้าบริษัท" },
  { value: "after_products", label: "หลัง สินค้าของเรา" },
  { value: "after_auction", label: "หลัง สินค้าประมูล" },
  { value: "after_recentOrders", label: "หลัง คำสั่งซื้อล่าสุด" },
  { value: "before_trustbar", label: "ก่อน Trust Bar" },
  { value: "after_trustbar", label: "หลัง Trust Bar" },
];

export default function HomePageContentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("sections");

  const [sections, setSections] = useState<Record<string, SectionConfig>>({});
  const [trustBar, setTrustBar] = useState<TrustBarItem[]>([]);
  const [footer, setFooter] = useState<FooterConfig>({
    title: "",
    description: "",
    links: [],
    visible: true,
  });
  const [customSections, setCustomSections] = useState<CustomSection[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/user/role").then((r) => r.json()),
      fetch("/api/admin/homepage-content").then((r) => r.json()),
    ])
      .then(([roleData, contentData]) => {
        if (
          roleData.error ||
          (roleData.role !== "admin" && roleData.role !== "owner")
        ) {
          router.push(roleData.role ? "/dashboard" : "/auth");
          return;
        }

        if (contentData && !contentData.error) {
          setSections(contentData.sections || {});
          setTrustBar(contentData.trustBar || []);
          setFooter(contentData.footer || { title: "", description: "", links: [], visible: true });
          setCustomSections(contentData.customSections || []);
        }
        setLoading(false);
      })
      .catch(() => {
        router.push("/auth");
      });
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/homepage-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections, trustBar, footer, customSections }),
      });
      if (res.ok) {
        alert("บันทึกสำเร็จ!");
      } else {
        alert("เกิดข้อผิดพลาดในการบันทึก");
      }
    } catch {
      alert("เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm("คุณต้องการรีเซ็ตกลับเป็นค่าเริ่มต้นหรือไม่? การเปลี่ยนแปลงทั้งหมดจะหายไป")) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/homepage-content", { method: "DELETE" });
      if (res.ok) {
        const data = await fetch("/api/admin/homepage-content").then((r) => r.json());
        setSections(data.sections || {});
        setTrustBar(data.trustBar || []);
        setFooter(data.footer || { title: "", description: "", links: [], visible: true });
        setCustomSections(data.customSections || []);
        alert("รีเซ็ตสำเร็จ!");
      }
    } catch {
      alert("เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  };

  const updateSection = useCallback(
    (key: string, field: string, value: any) => {
      setSections((prev) => ({
        ...prev,
        [key]: { ...prev[key], [field]: value },
      }));
    },
    []
  );

  const addCustomSection = () => {
    setCustomSections((prev) => [
      ...prev,
      {
        id: `custom_${Date.now()}`,
        title: "Section ใหม่",
        subtitle: "",
        position: "after_games",
        icon: "Star",
        glowColor: "rgba(99, 102, 241, 0.2)",
        sort: prev.length,
        visible: false,
        content: "",
      },
    ]);
  };

  const removeCustomSection = (id: string) => {
    if (!confirm("ลบ Section นี้?")) return;
    setCustomSections((prev) => prev.filter((s) => s.id !== id));
  };

  const updateCustomSection = (id: string, field: string, value: any) => {
    setCustomSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin mb-4" />
            <p className="text-gray-600">กำลังโหลด...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/admin/website-settings"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            กลับไปตั้งค่าเว็บไซต์
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                <LayoutGrid className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  จัดการเนื้อหาหน้าแรก
                </h1>
                <p className="text-gray-500 text-sm">
                  แก้ไขข้อความ เปิด/ปิด Section และเพิ่ม Section ใหม่
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                disabled={saving}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RotateCcw className="w-4 h-4 mr-1.5" />
                Reset Default
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-1.5" />
                {saving ? "กำลังบันทึก..." : "บันทึก"}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            {[
              { key: "sections" as TabType, label: "Section หลัก", icon: Type },
              { key: "trustbar" as TabType, label: "Trust Bar", icon: Shield },
              { key: "footer" as TabType, label: "Footer", icon: Globe },
              { key: "custom" as TabType, label: "Custom Section", icon: Sparkles },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          {activeTab === "sections" && (
            <SectionsTab
              sections={sections}
              updateSection={updateSection}
            />
          )}
          {activeTab === "trustbar" && (
            <TrustBarTab trustBar={trustBar} setTrustBar={setTrustBar} />
          )}
          {activeTab === "footer" && (
            <FooterTab footer={footer} setFooter={setFooter} />
          )}
          {activeTab === "custom" && (
            <CustomSectionsTab
              customSections={customSections}
              addCustomSection={addCustomSection}
              removeCustomSection={removeCustomSection}
              updateCustomSection={updateCustomSection}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ============ Sections Tab ============ */
function SectionsTab({
  sections,
  updateSection,
}: {
  sections: Record<string, SectionConfig>;
  updateSection: (key: string, field: string, value: any) => void;
}) {
  const sectionKeys = Object.keys(sections);

  return (
    <div className="space-y-4">
      {sectionKeys.map((key) => {
        const section = sections[key];
        const label = SECTION_LABELS[key] || key;
        const hasColorConfig = section.glowColor !== undefined;

        return (
          <div
            key={key}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <span className="font-semibold text-gray-900">{label}</span>
                <span className="text-xs text-gray-400 ml-2">({key})</span>
              </div>
              <button
                onClick={() =>
                  updateSection(key, "visible", !section.visible)
                }
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  section.visible
                    ? "text-red-600 bg-red-50 hover:bg-red-100"
                    : "text-green-600 bg-green-50 hover:bg-green-100"
                }`}
              >
                {section.visible ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" /> ซ่อน
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" /> แสดง
                  </>
                )}
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Title & Subtitle */}
              {section.title !== undefined && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      หัวข้อ (Title)
                    </label>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) =>
                        updateSection(key, "title", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      คำอธิบาย (Subtitle)
                    </label>
                    <input
                      type="text"
                      value={section.subtitle || ""}
                      onChange={(e) =>
                        updateSection(key, "subtitle", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* Color Config */}
              {hasColorConfig && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ColorInput
                      label="สี Glow (พื้นหลัง)"
                      value={section.glowColor || ""}
                      onChange={(v) => updateSection(key, "glowColor", v)}
                    />
                    <ColorInput
                      label="สีหัวข้อ (Title Color)"
                      value={section.titleColor || ""}
                      onChange={(v) => updateSection(key, "titleColor", v)}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ColorInput
                      label="สีพื้นหลัง Card"
                      value={section.cardBgColor || ""}
                      onChange={(v) => updateSection(key, "cardBgColor", v)}
                    />
                    <ColorInput
                      label="สีตัวอักษร Card"
                      value={section.cardTextColor || ""}
                      onChange={(v) => updateSection(key, "cardTextColor", v)}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ColorInput
                      label="สีปุ่ม (Button)"
                      value={section.buttonColor || ""}
                      onChange={(v) => updateSection(key, "buttonColor", v)}
                    />
                    <ColorInput
                      label="สีตัวอักษรปุ่ม"
                      value={section.buttonTextColor || ""}
                      onChange={(v) =>
                        updateSection(key, "buttonTextColor", v)
                      }
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ============ Trust Bar Tab ============ */
function TrustBarTab({
  trustBar,
  setTrustBar,
}: {
  trustBar: TrustBarItem[];
  setTrustBar: React.Dispatch<React.SetStateAction<TrustBarItem[]>>;
}) {
  const updateItem = (index: number, field: string, value: any) => {
    setTrustBar((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addItem = () => {
    setTrustBar((prev) => [
      ...prev,
      { title: "หัวข้อใหม่", desc: "คำอธิบาย", icon: "shield", visible: true },
    ]);
  };

  const removeItem = (index: number) => {
    setTrustBar((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {trustBar.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold text-gray-900">
              Trust Item #{index + 1}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateItem(index, "visible", !item.visible)}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg ${
                  item.visible
                    ? "text-red-600 bg-red-50 hover:bg-red-100"
                    : "text-green-600 bg-green-50 hover:bg-green-100"
                }`}
              >
                {item.visible ? (
                  <><EyeOff className="w-3.5 h-3.5" /> ซ่อน</>
                ) : (
                  <><Eye className="w-3.5 h-3.5" /> แสดง</>
                )}
              </button>
              <button
                onClick={() => removeItem(index)}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                หัวข้อ
              </label>
              <input
                type="text"
                value={item.title}
                onChange={(e) => updateItem(index, "title", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                คำอธิบาย
              </label>
              <input
                type="text"
                value={item.desc}
                onChange={(e) => updateItem(index, "desc", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                ไอคอน
              </label>
              <select
                value={item.icon}
                onChange={(e) => updateItem(index, "icon", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="shield">Shield</option>
                <option value="lock">Lock</option>
                <option value="clock">Clock</option>
                <option value="heart">Heart</option>
                <option value="star">Star</option>
                <option value="zap">Zap</option>
                <option value="award">Award</option>
                <option value="check">Check</option>
              </select>
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={addItem}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        เพิ่ม Trust Item ใหม่
      </button>
    </div>
  );
}

/* ============ Footer Tab ============ */
function FooterTab({
  footer,
  setFooter,
}: {
  footer: FooterConfig;
  setFooter: React.Dispatch<React.SetStateAction<FooterConfig>>;
}) {
  const updateLink = (index: number, field: string, value: string) => {
    setFooter((prev) => ({
      ...prev,
      links: prev.links.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      ),
    }));
  };

  const addLink = () => {
    setFooter((prev) => ({
      ...prev,
      links: [...prev.links, { label: "ลิงก์ใหม่", href: "/" }],
    }));
  };

  const removeLink = (index: number) => {
    setFooter((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">ตั้งค่า Footer</h3>
        <button
          onClick={() => setFooter((p) => ({ ...p, visible: !p.visible }))}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg ${
            footer.visible
              ? "text-red-600 bg-red-50 hover:bg-red-100"
              : "text-green-600 bg-green-50 hover:bg-green-100"
          }`}
        >
          {footer.visible ? (
            <><EyeOff className="w-3.5 h-3.5" /> ซ่อน</>
          ) : (
            <><Eye className="w-3.5 h-3.5" /> แสดง</>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            ชื่อเว็บไซต์
          </label>
          <input
            type="text"
            value={footer.title}
            onChange={(e) =>
              setFooter((p) => ({ ...p, title: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            คำอธิบาย
          </label>
          <input
            type="text"
            value={footer.description}
            onChange={(e) =>
              setFooter((p) => ({ ...p, description: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      </div>

      {/* Links */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2">
          ลิงก์ใน Footer
        </label>
        <div className="space-y-2">
          {footer.links.map((link, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={link.label}
                onChange={(e) => updateLink(i, "label", e.target.value)}
                placeholder="ชื่อลิงก์"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <input
                type="text"
                value={link.href}
                onChange={(e) => updateLink(i, "href", e.target.value)}
                placeholder="/path"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <button
                onClick={() => removeLink(i)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addLink}
          className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          เพิ่มลิงก์
        </button>
      </div>
    </div>
  );
}

/* ============ Custom Sections Tab ============ */
function CustomSectionsTab({
  customSections,
  addCustomSection,
  removeCustomSection,
  updateCustomSection,
}: {
  customSections: CustomSection[];
  addCustomSection: () => void;
  removeCustomSection: (id: string) => void;
  updateCustomSection: (id: string, field: string, value: any) => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {customSections.map((section) => {
        const isExpanded = expandedId === section.id;

        return (
          <div
            key={section.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* Collapsed header */}
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GripVertical className="w-4 h-4 text-gray-400" />
                <span className="font-semibold text-gray-900">
                  {section.title}
                </span>
                <span className="text-xs text-gray-400">
                  ({section.visible ? "แสดง" : "ซ่อนอยู่"})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setExpandedId(isExpanded ? null : section.id)
                  }
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  แก้ไข
                </button>
                <button
                  onClick={() => removeCustomSection(section.id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Expanded editor */}
            {isExpanded && (
              <div className="px-6 pb-6 border-t border-gray-100 pt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      หัวข้อ
                    </label>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) =>
                        updateCustomSection(
                          section.id,
                          "title",
                          e.target.value
                        )
                      }
                      placeholder="Section ใหม่"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      คำอธิบาย
                    </label>
                    <input
                      type="text"
                      value={section.subtitle}
                      onChange={(e) =>
                        updateCustomSection(
                          section.id,
                          "subtitle",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      ตำแหน่ง
                    </label>
                    <select
                      value={section.position}
                      onChange={(e) =>
                        updateCustomSection(
                          section.id,
                          "position",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      {POSITION_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      ไอคอน (Lucide)
                    </label>
                    <select
                      value={section.icon}
                      onChange={(e) =>
                        updateCustomSection(
                          section.id,
                          "icon",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      {ICON_OPTIONS.map((icon) => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      สี Glow
                    </label>
                    <input
                      type="text"
                      value={section.glowColor}
                      onChange={(e) =>
                        updateCustomSection(
                          section.id,
                          "glowColor",
                          e.target.value
                        )
                      }
                      placeholder="rgba(99, 102, 241, 0.2)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      ลำดับ (Sort)
                    </label>
                    <input
                      type="number"
                      value={section.sort}
                      onChange={(e) =>
                        updateCustomSection(
                          section.id,
                          "sort",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div className="flex items-end pb-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={section.visible}
                        onChange={(e) =>
                          updateCustomSection(
                            section.id,
                            "visible",
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-indigo-600 rounded"
                      />
                      <span className="text-sm text-gray-700">
                        แสดงบนหน้าเว็บ
                      </span>
                    </label>
                  </div>
                </div>

                {/* Tiptap Editor */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    เนื้อหา (Rich Text Editor)
                  </label>
                  <TiptapEditor
                    content={section.content}
                    onChange={(html) =>
                      updateCustomSection(section.id, "content", html)
                    }
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}

      <button
        onClick={addCustomSection}
        className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        เพิ่ม Custom Section ใหม่
      </button>
    </div>
  );
}

/* ============ Color Input Component ============ */
function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const hexValue = value.startsWith("rgba") || value.startsWith("rgb")
    ? "#6366f1"
    : value || "#ffffff";

  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={hexValue}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg cursor-pointer border border-gray-300 p-0.5"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </div>
    </div>
  );
}
