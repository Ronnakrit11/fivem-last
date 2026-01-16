"use client";

import { useState } from "react";
import { Upload, Check, AlertCircle, Loader2, Copy, CheckCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useBalance } from "@/app/contexts/BalanceContext";
import { toast } from "sonner";

export default function SlipUpload() {
  const router = useRouter();
  const { updateBalance } = useBalance();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    data?: {
      amount: number;
      transRef: string;
      newBalance: number;
    };
  } | null>(null);

  const accountNumber = "781-255111-8";

  const copyAccountNumber = async () => {
    try {
      await navigator.clipboard.writeText(accountNumber.replace(/-/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("slip", file);

      const response = await fetch("/api/topup/verify-slip", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: data.message,
          data: data.data,
        });
        // Show success toast
        toast.success("เติมเงินสำเร็จ");
        // Update balance immediately
        if (data.data?.newBalance !== undefined) {
          updateBalance(data.data.newBalance);
        }
        // Clear form after success
        setFile(null);
        setPreview(null);
      } else {
        setResult({
          success: false,
          message: data.message || "เกิดข้อผิดพลาด",
        });
        // Show error toast
        toast.error(data.message || "เกิดข้อผิดพลาด");
      }
    } catch {
      setResult({
        success: false,
        message: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้",
      });
      // Show error toast
      toast.error("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Account Information - Compact */}
      <div className="rounded-2xl overflow-hidden bg-[#03AC13]/20 backdrop-blur-xl border border-[#03AC13]/30 ring-1 ring-[#03AC13]/10 shadow-xl">
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">ข้อมูลบัญชีสำหรับโอนเงิน</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            {/* Account Name */}
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <p className="text-xs text-gray-400 mb-1">ชื่อบัญชี</p>
              <p className="text-sm font-semibold text-white">ณพล อิสระบุตร</p>
            </div>
            
            {/* Bank Name */}
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <p className="text-xs text-gray-400 mb-1">ธนาคาร</p>
              <p className="text-sm font-semibold text-white">ไทยพาณิชย์</p>
            </div>
          </div>
          
          {/* Account Number with Copy Button - Full Width */}
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-1">เลขที่บัญชี</p>
                <p className="text-xl font-mono font-bold text-white tracking-wider">{accountNumber}</p>
              </div>
              <button
                onClick={copyAccountNumber}
                className="flex-shrink-0 p-2.5 rounded-lg bg-indigo-500/30 hover:bg-indigo-500/40 border border-indigo-400/40 transition-all group"
                title="คัดลอก"
              >
                {copied ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <Copy className="w-5 h-5 text-indigo-300 group-hover:text-indigo-200" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Section - Compact */}
      <div className="rounded-2xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 ring-1 ring-white/5 shadow-xl">
        <div className="p-5">
          <h2 className="text-xl font-bold text-white mb-4">
            อัปโหลดสลิปโอนเงิน
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload Area */}
          <div className="border-2 border-dashed border-white/30 rounded-xl p-6 text-center hover:border-indigo-400/50 transition-colors bg-white/5">
            <input
              type="file"
              id="slip-upload"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={loading}
            />
            <label
              htmlFor="slip-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              {preview ? (
                <div className="space-y-3">
                  <Image
                    src={preview}
                    alt="Preview"
                    width={400}
                    height={200}
                    className="max-h-48 rounded-lg shadow-md object-contain"
                  />
                  <p className="text-xs text-gray-300">{file?.name}</p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setFile(null);
                      setPreview(null);
                    }}
                    className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    เปลี่ยนไฟล์
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-gray-400 mb-3" />
                  <p className="text-base font-medium text-white mb-1">
                    คลิกเพื่อเลือกสลิปโอนเงิน
                  </p>
                  <p className="text-xs text-gray-400">
                    PNG, JPG, WEBP (สูงสุด 10MB)
                  </p>
                </>
              )}
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!file || loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                กำลังตรวจสอบสลิป...
              </>
            ) : (
              "ตรวจสอบและเติมเงิน"
            )}
          </button>
        </form>

        {/* Result Message - Compact */}
        {result && (
          <div
            className={`mt-4 p-3 rounded-xl ${
              result.success
                ? "bg-green-500/20 border border-green-400/30 backdrop-blur-xl"
                : "bg-red-500/20 border border-red-400/30 backdrop-blur-xl"
            }`}
          >
            <div className="flex items-start gap-2">
              {result.success ? (
                <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p
                  className={`font-semibold text-sm ${
                    result.success ? "text-green-300" : "text-red-300"
                  }`}
                >
                  {result.message}
                </p>
                {result.success && result.data && (
                  <div className="mt-2 space-y-0.5 text-xs text-gray-300">
                    <p>จำนวน: ฿{result.data.amount.toLocaleString()} | คงเหลือ: ฿{result.data.newBalance.toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

          
        </div>
      </div>
    </div>
  );
}