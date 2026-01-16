import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Eye } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import ArticleContent from "./ArticleContent";

// Force dynamic rendering to avoid DYNAMIC_SERVER_USAGE error
export const dynamic = 'force-dynamic';

interface Article {
  id: string;
  title: string;
  description: string;
  keywords: string;
  slug: string;
  coverImage: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
}

async function getArticle(slug: string): Promise<Article | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/articles/${slug}`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.success ? data.article : null;
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
}

// Generate static params for published articles
export async function generateStaticParams() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/articles`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const articles = data.articles || [];

    return articles.map((article: Article) => ({
      slug: article.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return {
      title: "บทความไม่พบ | infinitygamecenter",
      description: "ไม่พบบทความที่คุณค้นหา",
    };
  }

  const keywords = article.keywords ? article.keywords.split(",").map(k => k.trim()) : [];

  return {
    title: `${article.title} | infinitygamecenter`,
    description: article.description || article.title,
    keywords: keywords,
    openGraph: {
      title: article.title,
      description: article.description || article.title,
      images: article.coverImage ? [article.coverImage] : [],
      type: "article",
      publishedTime: article.createdAt,
      modifiedTime: article.updatedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description || article.title,
      images: article.coverImage ? [article.coverImage] : [],
    },
  };
}

export default async function ArticlePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          กลับสู่หน้าหลัก
        </Link>

        {/* Article Header */}
        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Cover Image */}
          {article.coverImage && (
            <div className="w-full h-64 md:h-96 overflow-hidden">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 md:p-10">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>

            {/* Meta Info */}
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1.5" />
                {new Date(article.createdAt).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              {article.updatedAt !== article.createdAt && (
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1.5" />
                  อัพเดต: {new Date(article.updatedAt).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              )}
            </div>

            {/* Description */}
            {article.description && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-emerald-500">
                <p className="text-gray-700 leading-relaxed">
                  {article.description}
                </p>
              </div>
            )}

            {/* Content */}
            <ArticleContent content={article.content} />

            {/* Keywords */}
            {article.keywords && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">แท็ก:</h3>
                <div className="flex flex-wrap gap-2">
                  {article.keywords.split(",").map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm"
                    >
                      {keyword.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Back to Home Button */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            กลับสู่หน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  );
}
