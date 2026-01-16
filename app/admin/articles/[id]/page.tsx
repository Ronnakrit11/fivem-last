"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Image as ImageIcon, X } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

const TiptapEditor = dynamic(() => import("@/app/components/TiptapEditor"), {
  ssr: false,
});

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    keywords: "",
    slug: "",
    content: "",
    published: false,
  });

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      const response = await fetch(`/api/admin/articles/${id}`);

      if (response.status === 401) {
        router.push("/auth");
        return;
      }

      if (response.status === 403) {
        router.push("/dashboard");
        return;
      }

      if (response.status === 404) {
        alert("ไม่พบบทความ");
        router.push("/admin/articles");
        return;
      }

      const data = await response.json();
      
      if (data.article) {
        setFormData({
          title: data.article.title || "",
          description: data.article.description || "",
          keywords: data.article.keywords || "",
          slug: data.article.slug || "",
          content: data.article.content || "",
          published: data.article.published || false,
        });
        setCoverImage(data.article.coverImage);
      }
    } catch (error) {
      console.error("Error fetching article:", error);
      alert("เกิดข้อผิดพลาดในการโหลดบทความ");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/articles/upload-cover", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success && data.url) {
        setCoverImage(data.url);
      } else {
        alert("ไม่สามารถอัพโหลดรูปปกได้");
      }
    } catch (error) {
      console.error("Error uploading cover:", error);
      alert("เกิดข้อผิดพลาดในการอัพโหลดรูปปก");
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.slug || !formData.content) {
      alert("กรุณากรอกชื่อบทความ, slug และเนื้อหา");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/admin/articles/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          coverImage,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("อัพเดตบทความสำเร็จ");
        router.push("/admin/articles");
      } else {
        alert(data.error || "ไม่สามารถอัพเดตบทความได้");
      }
    } catch (error) {
      console.error("Error updating article:", error);
      alert("เกิดข้อผิดพลาดในการอัพเดตบทความ");
    } finally {
      setSaving(false);
    }
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\u0E00-\u0E7Fa-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setFormData((prev) => ({ ...prev, slug }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-300">กำลังโหลด...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/articles"
            className="inline-flex items-center text-sm text-gray-300 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            กลับไปรายการบทความ
          </Link>
          <h1 className="text-3xl font-bold text-white">แก้ไขบทความ</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Image */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-slate-700">
            <label className="block text-sm font-medium text-gray-200 mb-2">
              รูปปก
            </label>
            {coverImage ? (
              <div className="relative inline-block">
                <img
                  src={coverImage}
                  alt="Cover"
                  className="w-full max-w-md h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setCoverImage(null)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                disabled={uploadingCover}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                <ImageIcon className="w-5 h-5 mr-2" />
                {uploadingCover ? "กำลังอัพโหลด..." : "อัพโหลดรูปปก"}
              </button>
            )}
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              className="hidden"
            />
          </div>

          {/* Title */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-slate-700">
            <label className="block text-sm font-medium text-gray-200 mb-2">
              ชื่อบทความ <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 transition-all"
              placeholder="ชื่อบทความ"
            />
          </div>

          {/* Slug */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-slate-700">
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Slug <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="flex-1 px-4 py-3 bg-slate-900/50 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 transition-all"
                placeholder="url-friendly-slug"
              />
              <button
                type="button"
                onClick={generateSlug}
                className="px-4 py-3 bg-slate-700 text-gray-200 rounded-lg hover:bg-slate-600 transition-colors"
              >
                สร้างจากชื่อ
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-slate-700">
            <label className="block text-sm font-medium text-gray-200 mb-2">
              คำอธิบาย (Description)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 transition-all resize-none"
              placeholder="คำอธิบายสำหรับ SEO"
            />
          </div>

          {/* Keywords */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-slate-700">
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Keywords (คั่นด้วย ,)
            </label>
            <input
              type="text"
              name="keywords"
              value={formData.keywords}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 transition-all"
              placeholder="keyword1, keyword2, keyword3"
            />
          </div>

          {/* Content */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-slate-700">
            <label className="block text-sm font-medium text-gray-200 mb-4">
              เนื้อหาบทความ <span className="text-red-500">*</span>
            </label>
            <TiptapEditor
              content={formData.content}
              onChange={handleContentChange}
            />
          </div>

          {/* Published */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-slate-700">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="published"
                checked={formData.published}
                onChange={handleChange}
                className="w-5 h-5 text-indigo-600 bg-slate-900/50 border-slate-600 rounded focus:ring-indigo-500 focus:ring-2"
              />
              <span className="ml-3 text-sm font-medium text-gray-200">
                เผยแพร่บทความ
              </span>
            </label>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4 pt-4">
            <Link
              href="/admin/articles"
              className="px-6 py-3 border border-slate-600 text-gray-300 rounded-lg hover:bg-slate-700 transition-colors"
            >
              ยกเลิก
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl"
            >
              <Save className="w-5 h-5 mr-2" />
              {saving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
