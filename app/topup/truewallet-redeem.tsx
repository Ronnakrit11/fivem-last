"use client";

import { useState } from "react";
import { Gift, Loader2, Check, AlertCircle, Link as LinkIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useBalance } from "@/app/contexts/BalanceContext";
import { toast } from "sonner";

export default function TrueWalletRedeem() {
  const router = useRouter();
  const { updateBalance } = useBalance();
  const [voucherUrl, setVoucherUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    data?: {
      amount: number;
      newBalance: number;
    };
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherUrl.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/topup/redeem-tw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: voucherUrl }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
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
        setVoucherUrl("");
      } else {
        setResult({
          success: false,
          message: data.error || data.message || "เกิดข้อผิดพลาด",
        });
        // Show error toast
        toast.error(data.error || data.message || "เกิดข้อผิดพลาด");
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
      {/* TrueWallet Info Section - Compact */}
      <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-pink-500/20 to-rose-600/20 backdrop-blur-xl border border-pink-400/30 ring-1 ring-pink-400/10 shadow-xl">
        <div className="p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-pink-500/30 border border-pink-400/40 flex items-center justify-center flex-shrink-0">
              <Gift className="w-5 h-5 text-pink-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white mb-1">อั่งเปาทรูวอเล็ท</h2>
              <p className="text-xs text-gray-300">แลกซองอั่งเปาเป็นเครดิต (หัก 2.9% ค่าธรรมเนียม)</p>
            </div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <p className="text-xs text-gray-400 mb-2 font-medium">วิธีใช้งาน:</p>
            <ul className="text-xs text-gray-300 space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-pink-400 mt-0.5">1.</span>
                <span>คัดลอกลิงก์อั่งเปาจาก TrueWallet</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-400 mt-0.5">2.</span>
                <span>วางลิงก์ในช่องด้านล่าง</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-400 mt-0.5">3.</span>
                <span>กดยืนยัน และรอเงินเข้าบัญชี</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Redeem Section - Compact */}
      <div className="rounded-2xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 ring-1 ring-white/5 shadow-xl">
        <div className="p-5">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-pink-400" />
            กรอกลิงก์อั่งเปา
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Voucher URL Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                ลิงก์อั่งเปาทรูวอเล็ท
              </label>
              <input
                type="text"
                value={voucherUrl}
                onChange={(e) => setVoucherUrl(e.target.value)}
                placeholder="https://gift.truemoney.com/campaign/?v=..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                disabled={loading}
              />
              <p className="text-xs text-gray-400 mt-2">
                รองรับลิงก์แบบ: gift.truemoney.com/?v=xxx หรือ voucher code โดยตรง
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!voucherUrl.trim() || loading}
              className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-3 rounded-xl font-semibold hover:from-pink-700 hover:to-rose-700 transition-all disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  กำลังตรวจสอบ...
                </>
              ) : (
                <>
                  <Gift className="w-5 h-5" />
                  แลกซองอั่งเปา
                </>
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
                      <p>
                        จำนวนเงินที่ได้รับ: ฿{result.data.amount.toLocaleString()} (หลังหัก 2.9%)
                      </p>
                      <p>ยอดคงเหลือ: ฿{result.data.newBalance.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Warning Notice */}
      <div className="rounded-2xl overflow-hidden bg-amber-500/10 backdrop-blur-xl border border-amber-400/20 ring-1 ring-amber-400/5 shadow-lg">
        <div className="p-4">
          <h4 className="font-semibold text-amber-300 text-sm mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            ข้อควรระวัง
          </h4>
          <ul className="text-xs text-gray-300 space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="text-amber-400 mt-0.5">•</span>
              <span>ระบบจะหัก 2.9% เป็นค่าธรรมเนียม</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 mt-0.5">•</span>
              <span>ซองอั่งเปาแต่ละซองใช้ได้เพียงครั้งเดียว</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 mt-0.5">•</span>
              <span>เงินจะเข้าบัญชีทันทีหลังระบบตรวจสอบ</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 mt-0.5">•</span>
              <span>หากมีปัญหา กรุณาติดต่อฝ่ายสนับสนุน</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
