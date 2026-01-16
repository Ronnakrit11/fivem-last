"use client";

import { useEffect, useState } from "react";
import { FileText, ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";

interface Article {
  id: string;
  title: string;
  description: string;
  slug: string;
  coverImage: string | null;
  createdAt: string;
}

export default function ArticlesSection() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch("/api/articles");
      const data = await response.json();

      if (data.success) {
        setArticles(data.articles || []);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-14 md:mt-16">
        <div className="text-center mb-8 md:mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/80 to-teal-600/80 backdrop-blur-xl border border-white/30 ring-1 ring-black/5 shadow-lg mb-4 animate-pulse" />
          <div className="h-8 w-48 bg-gray-200 rounded-lg mx-auto mb-2 animate-pulse" />
          <div className="h-4 w-64 bg-gray-200 rounded mx-auto animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden animate-pulse bg-white/50 backdrop-blur-xl border border-white/30 ring-1 ring-black/5 shadow-md"
            >
              <div className="w-full h-48 bg-gray-200" />
              <div className="p-6 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return null;
  }

  return (
    <div className="mt-14 md:mt-16">
      <div className="text-center mb-10 md:mb-14 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-emerald-500/20 blur-[60px] rounded-full -z-10" />
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass-panel mb-6 group hover:scale-110 transition-transform duration-300">
          <FileText className="w-8 h-8 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight text-glow-blue">
          บทความและเนื้อหา
        </h2>
        <p className="text-base md:text-lg text-slate-400 font-medium">
          ข่าวสาร บทความ และเคล็ดลับที่น่าสนใจ
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/articles/${article.slug}`}
            className="group rounded-xl overflow-hidden home-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-105"
          >
            {article.coverImage ? (
              <div className="relative w-full h-48 overflow-hidden bg-gray-100">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ) : (
              <div className="w-full h-48 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                <FileText className="w-16 h-16 text-emerald-600/50" />
              </div>
            )}

            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-200 mb-2 line-clamp-2 group-hover:text-emerald-400 transition-colors">
                {article.title}
              </h3>

              <p className="text-sm text-gray-300 mb-4 line-clamp-2">
                {article.description}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1" />
                  {new Date(article.createdAt).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>

                <div className="flex items-center text-emerald-600 group-hover:text-emerald-700 font-medium">
                  อ่านเพิ่มเติม
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
