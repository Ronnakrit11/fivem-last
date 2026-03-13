"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Settings, Upload, Image as ImageIcon, Palette, RotateCcw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/app/contexts/ThemeContext";

export default function WebsiteSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [savingColors, setSavingColors] = useState(false);
  const [settings, setSettings] = useState({
    logoUrl: "",
    bannerUrl: "",
  });
  
  const { colors, updateColors, resetColors, refreshColors } = useTheme();
  const [tempColors, setTempColors] = useState(colors);

  useEffect(() => {
    // Check if user is admin
    fetch("/api/user/role")
      .then(res => res.json())
      .then(data => {
        if (data.error || (data.role !== "admin" && data.role !== "owner")) {
          router.push(data.role ? "/dashboard" : "/auth");
          return;
        }
        // Fetch website assets (logo & banner)
        fetch("/api/website-assets")
          .then(res => res.json())
          .then(assets => {
            setSettings({
              logoUrl: assets.logoUrl || "",
              bannerUrl: assets.bannerUrl || "",
            });
          })
          .catch(err => console.error("Error fetching assets:", err));
        setLoading(false);
      })
      .catch(err => {
        console.error("Error checking role:", err);
        router.push("/auth");
      });
  }, [router]);

  // Sync tempColors with colors from context
  useEffect(() => {
    setTempColors(colors);
  }, [colors]);

  const handleSaveColors = async () => {
    setSavingColors(true);
    try {
      const response = await fetch("/api/admin/website-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tempColors),
      });

      if (response.ok) {
        updateColors(tempColors);
        await refreshColors();
        alert("บันทึกการตั้งค่าสีสำเร็จ!\n\nกรุณารอสักครู่ ระบบกำลัง reload...");
        // Force reload to apply new colors
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        alert("เกิดข้อผิดพลาดในการบันทึก");
      }
    } catch (error) {
      console.error("Error saving colors:", error);
      alert("เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setSavingColors(false);
    }
  };

  const handleResetColors = async () => {
    if (!confirm("คุณต้องการรีเซ็ตสีกลับเป็นค่าเริ่มต้นหรือไม่?")) {
      return;
    }

    setSavingColors(true);
    try {
      const defaultColors = {
        navbarColor: "rgba(15, 23, 42, 0.7)",
        backgroundColor: "#0a0e1a",
        bottomNavColor: "rgba(15, 23, 42, 0.7)",
        homeButtonBgColor: "rgba(255, 255, 255, 0.1)",
        homeButtonTextColor: "#d1d5db",
        homeButtonActiveBg: "rgba(255, 255, 255, 0.1)",
        homeButtonActiveText: "#a78bfa",
        bottomNavIconColor: "#d1d5db",
        bottomNavTextColor: "#d1d5db",
        bottomNavActiveIcon: "#fbbf24",
        bottomNavActiveText: "#fbbf24",
      };

      const response = await fetch("/api/admin/website-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(defaultColors),
      });

      if (response.ok) {
        setTempColors(defaultColors);
        updateColors(defaultColors);
        await refreshColors();
        alert("รีเซ็ตค่าเริ่มต้นสำเร็จ!");
      } else {
        alert("เกิดข้อผิดพลาดในการรีเซ็ต");
      }
    } catch (error) {
      console.error("Error resetting colors:", error);
      alert("เกิดข้อผิดพลาดในการรีเซ็ต");
    } finally {
      setSavingColors(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
      return;
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("ขนาดไฟล์ต้องไม่เกิน 2MB");
      return;
    }

    setUploadingLogo(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/upload-logo", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setSettings(prev => ({ ...prev, logoUrl: data.url }));
        alert("อัพโหลดโลโก้สำเร็จ! รูปจะอัพเดททันที");
      } else {
        alert(data.error || "อัพโหลดไฟล์ล้มเหลว");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("เกิดข้อผิดพลาดในการอัพโหลด");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
      return;
    }

    // Check file size (max 5MB for banner)
    if (file.size > 5 * 1024 * 1024) {
      alert("ขนาดไฟล์ต้องไม่เกิน 5MB");
      return;
    }

    setUploadingBanner(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/upload-banner", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setSettings(prev => ({ ...prev, bannerUrl: data.url }));
        alert("อัพโหลดแบนเนอร์สำเร็จ! รูปจะอัพเดททันที");
      } else {
        alert(data.error || "อัพโหลดไฟล์ล้มเหลว");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("เกิดข้อผิดพลาดในการอัพโหลด");
    } finally {
      setUploadingBanner(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin mb-4" />
            <p className="text-gray-600">กำลังโหลด...</p>
          </div>
        </div>
      </div>
    );
  }

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
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                <Settings className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  ตั้งค่าเว็บไซต์
                </h1>
                <p className="text-gray-600">
                  จัดการข้อมูลและการตั้งค่าทั่วไปของเว็บไซต์
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* จัดการเนื้อหาหน้าแรก */}
        <Link
          href="/admin/homepage-content"
          className="mb-6 block bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-5 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-indigo-100 rounded-full flex items-center justify-center">
                <Palette className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">จัดการเนื้อหาหน้าแรก</h3>
                <p className="text-sm text-gray-500">แก้ไขข้อความ เปิด/ปิด Section เพิ่ม Custom Section ด้วย Rich Text Editor</p>
              </div>
            </div>
            <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Settings Form */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">ข้อมูลเว็บไซต์</h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                โลโก้เว็บไซต์
              </label>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 border-2 border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
                    {settings.logoUrl ? (
                      <Image
                        src={settings.logoUrl}
                        alt="Logo"
                        width={80}
                        height={80}
                        className="w-20 h-20 object-contain"
                      />
                    ) : (
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-700 mb-2">
                    <strong>ไฟล์ปัจจุบัน:</strong> {settings.logoUrl}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    {uploadingLogo ? (
                      <>
                        <div className="inline-block w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2" />
                        กำลังอัพโหลด...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        เลือกไฟล์โลโก้ใหม่
                      </>
                    )}
                  </label>
                  <p className="mt-2 text-xs text-gray-500">
                    รองรับไฟล์: PNG, JPG, GIF (สูงสุด 2MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Banner */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                แบนเนอร์หน้าหลัก
              </label>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-48 h-24 border-2 border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
                    {settings.bannerUrl ? (
                      <Image
                        src={settings.bannerUrl}
                        alt="Banner"
                        width={192}
                        height={96}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-700 mb-2">
                    <strong>ไฟล์ปัจจุบัน:</strong> {settings.bannerUrl}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerUpload}
                    className="hidden"
                    id="banner-upload"
                  />
                  <label
                    htmlFor="banner-upload"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    {uploadingBanner ? (
                      <>
                        <div className="inline-block w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2" />
                        กำลังอัพโหลด...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        เลือกไฟล์แบนเนอร์ใหม่
                      </>
                    )}
                  </label>
                  <p className="mt-2 text-xs text-gray-500">
                    รองรับไฟล์: PNG, JPG, GIF (สูงสุด 5MB) | ขนาดแนะนำ: 1920x400px
                  </p>
                </div>
              </div>
            </div>

            {/* Color Settings */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Palette className="w-5 h-5 text-teal-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">การตั้งค่าสี</h3>
                </div>
                <button
                  onClick={handleResetColors}
                  disabled={savingColors}
                  className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <RotateCcw className="w-4 h-4 mr-1.5" />
                  รีเซ็ตเป็นค่าเริ่มต้น
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Navbar Color */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    สี Navbar
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={tempColors.navbarColor.startsWith('rgba') ? '#0f172a' : tempColors.navbarColor}
                      onChange={(e) => setTempColors({ ...tempColors, navbarColor: e.target.value })}
                      className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300"
                    />
                    <input
                      type="text"
                      value={tempColors.navbarColor}
                      onChange={(e) => setTempColors({ ...tempColors, navbarColor: e.target.value })}
                      placeholder="rgba(15, 23, 42, 0.7)"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    รองรับ HEX, RGB, RGBA (เช่น #0f172a หรือ rgba(15, 23, 42, 0.7))
                  </p>
                </div>

                {/* Background Color */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    สีพื้นหลัง
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={tempColors.backgroundColor}
                      onChange={(e) => setTempColors({ ...tempColors, backgroundColor: e.target.value })}
                      className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300"
                    />
                    <input
                      type="text"
                      value={tempColors.backgroundColor}
                      onChange={(e) => setTempColors({ ...tempColors, backgroundColor: e.target.value })}
                      placeholder="#0a0e1a"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    รองรับ HEX, RGB, RGBA
                  </p>
                </div>

                {/* Bottom Nav Color */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    สี Bottom Navigation
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={tempColors.bottomNavColor.startsWith('rgba') ? '#0f172a' : tempColors.bottomNavColor}
                      onChange={(e) => setTempColors({ ...tempColors, bottomNavColor: e.target.value })}
                      className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300"
                    />
                    <input
                      type="text"
                      value={tempColors.bottomNavColor}
                      onChange={(e) => setTempColors({ ...tempColors, bottomNavColor: e.target.value })}
                      placeholder="rgba(15, 23, 42, 0.7)"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    รองรับ HEX, RGB, RGBA (เช่น #0f172a หรือ rgba(15, 23, 42, 0.7))
                  </p>
                </div>

                {/* Home Button Colors Section */}
                <div className="border-t border-gray-200 pt-4 mt-2">
                  <h4 className="text-md font-semibold text-gray-800 mb-3">สีปุ่มหน้าหลัก</h4>
                  
                  <div className="space-y-4">
                    {/* Home Button Background */}
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        สีพื้นหลังปุ่ม (ปกติ)
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={tempColors.homeButtonBgColor.startsWith('rgba') ? '#ffffff' : tempColors.homeButtonBgColor}
                          onChange={(e) => setTempColors({ ...tempColors, homeButtonBgColor: e.target.value })}
                          className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300"
                        />
                        <input
                          type="text"
                          value={tempColors.homeButtonBgColor}
                          onChange={(e) => setTempColors({ ...tempColors, homeButtonBgColor: e.target.value })}
                          placeholder="rgba(255, 255, 255, 0.1)"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Home Button Text */}
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        สีข้อความปุ่ม (ปกติ)
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={tempColors.homeButtonTextColor}
                          onChange={(e) => setTempColors({ ...tempColors, homeButtonTextColor: e.target.value })}
                          className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300"
                        />
                        <input
                          type="text"
                          value={tempColors.homeButtonTextColor}
                          onChange={(e) => setTempColors({ ...tempColors, homeButtonTextColor: e.target.value })}
                          placeholder="#d1d5db"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Home Button Active Background */}
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        สีพื้นหลังปุ่ม (Active)
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={tempColors.homeButtonActiveBg.startsWith('rgba') ? '#ffffff' : tempColors.homeButtonActiveBg}
                          onChange={(e) => setTempColors({ ...tempColors, homeButtonActiveBg: e.target.value })}
                          className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300"
                        />
                        <input
                          type="text"
                          value={tempColors.homeButtonActiveBg}
                          onChange={(e) => setTempColors({ ...tempColors, homeButtonActiveBg: e.target.value })}
                          placeholder="rgba(255, 255, 255, 0.1)"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Home Button Active Text */}
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        สีข้อความปุ่ม (Active)
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={tempColors.homeButtonActiveText}
                          onChange={(e) => setTempColors({ ...tempColors, homeButtonActiveText: e.target.value })}
                          className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300"
                        />
                        <input
                          type="text"
                          value={tempColors.homeButtonActiveText}
                          onChange={(e) => setTempColors({ ...tempColors, homeButtonActiveText: e.target.value })}
                          placeholder="#a78bfa"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Nav Colors Section */}
                <div className="border-t border-gray-200 pt-4 mt-2">
                  <h4 className="text-md font-semibold text-gray-800 mb-3">สีไอคอนและข้อความ Bottom Navigation</h4>
                  
                  <div className="space-y-4">
                    {/* Bottom Nav Icon Color */}
                    <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        สีไอคอน (ปกติ)
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={tempColors.bottomNavIconColor}
                          onChange={(e) => setTempColors({ ...tempColors, bottomNavIconColor: e.target.value })}
                          className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300"
                        />
                        <input
                          type="text"
                          value={tempColors.bottomNavIconColor}
                          onChange={(e) => setTempColors({ ...tempColors, bottomNavIconColor: e.target.value })}
                          placeholder="#d1d5db"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Bottom Nav Text Color */}
                    <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        สีข้อความ (ปกติ)
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={tempColors.bottomNavTextColor}
                          onChange={(e) => setTempColors({ ...tempColors, bottomNavTextColor: e.target.value })}
                          className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300"
                        />
                        <input
                          type="text"
                          value={tempColors.bottomNavTextColor}
                          onChange={(e) => setTempColors({ ...tempColors, bottomNavTextColor: e.target.value })}
                          placeholder="#d1d5db"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Bottom Nav Active Icon */}
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        สีไอคอน (Active)
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={tempColors.bottomNavActiveIcon}
                          onChange={(e) => setTempColors({ ...tempColors, bottomNavActiveIcon: e.target.value })}
                          className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300"
                        />
                        <input
                          type="text"
                          value={tempColors.bottomNavActiveIcon}
                          onChange={(e) => setTempColors({ ...tempColors, bottomNavActiveIcon: e.target.value })}
                          placeholder="#fbbf24"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Bottom Nav Active Text */}
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        สีข้อความ (Active)
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={tempColors.bottomNavActiveText}
                          onChange={(e) => setTempColors({ ...tempColors, bottomNavActiveText: e.target.value })}
                          className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300"
                        />
                        <input
                          type="text"
                          value={tempColors.bottomNavActiveText}
                          onChange={(e) => setTempColors({ ...tempColors, bottomNavActiveText: e.target.value })}
                          placeholder="#fbbf24"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleSaveColors}
                    disabled={savingColors}
                    className="px-6 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {savingColors ? (
                      <>
                        <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        กำลังบันทึก...
                      </>
                    ) : (
                      "บันทึกการตั้งค่าสี"
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">การตั้งค่าเพิ่มเติม</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">โหมดบำรุงรักษา</p>
                    <p className="text-sm text-gray-500">ปิดเว็บไซต์ชั่วคราวเพื่อบำรุงรักษา</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">อนุญาตการสมัครสมาชิก</p>
                    <p className="text-sm text-gray-500">เปิด/ปิดการสมัครสมาชิกใหม่</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <Link
              href="/admin"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              กลับ
            </Link>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>หมายเหตุ:</strong> การเปลี่ยนแปลงบางอย่างอาจต้อง Refresh หน้าเว็บไซต์เพื่อให้เห็นผลลัพธ์
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
