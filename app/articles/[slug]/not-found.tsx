import Link from "next/link";
import { ArrowLeft, FileX } from "lucide-react";

export default function ArticleNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-4">
            <FileX className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ไม่พบบทความ
          </h1>
          <p className="text-gray-600 mb-8">
            ขออภัย เราไม่พบบทความที่คุณกำลังค้นหา บทความอาจถูกลบหรือย้ายไปแล้ว
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          กลับสู่หน้าหลัก
        </Link>
      </div>
    </div>
  );
}
