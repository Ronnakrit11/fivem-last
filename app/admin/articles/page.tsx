"use client";


import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, ArrowLeft, Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

interface Article {
  id: string;
  title: string;
  description: string;
  keywords: string;
  slug: string;
  coverImage: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminArticlesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch("/api/admin/articles");
      
      if (response.status === 401) {
        router.push("/auth");
        return;
      }
      
      if (response.status === 403) {
        router.push("/dashboard");
        return;
      }

      const data = await response.json();
      setArticles(data.articles || []);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`คุณต้องการลบบทความ "${title}" ใช่หรือไม่?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/articles/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("ลบบทความสำเร็จ");
        fetchArticles();
      } else {
        alert("ไม่สามารถลบบทความได้");
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("เกิดข้อผิดพลาดในการลบบทความ");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  จัดการบทความ
                </h1>
                <p className="text-gray-600">
                  บทความทั้งหมด ({articles.length} รายการ)
                </p>
              </div>
            </div>
            <Link
              href="/admin/articles/new"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              สร้างบทความใหม่
            </Link>
          </div>
        </div>

        {/* Articles List */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">กำลังโหลด...</div>
          ) : articles.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              ยังไม่มีบทความ
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      รูปปก
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ชื่อบทความ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      สถานะ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      วันที่สร้าง
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      จัดการ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {articles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {article.coverImage ? (
                          <img
                            src={article.coverImage}
                            alt={article.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                            <FileText className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {article.title}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {article.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {article.slug}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {article.published ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Eye className="w-3 h-3 mr-1" />
                            เผยแพร่
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            <EyeOff className="w-3 h-3 mr-1" />
                            ฉบับร่าง
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(article.createdAt).toLocaleDateString("th-TH")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/admin/articles/${article.id}`}
                          className="inline-flex items-center px-3 py-1 text-indigo-600 hover:text-indigo-900 mr-2"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          แก้ไข
                        </Link>
                        <button
                          onClick={() => handleDelete(article.id, article.title)}
                          className="inline-flex items-center px-3 py-1 text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          ลบ
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
