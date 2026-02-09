"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Gavel, Clock, Trophy, XCircle, Loader2, Upload, Download, CheckCircle, Image as ImageIcon, X, Building2, AlertCircle, Bitcoin, CreditCard } from "lucide-react";
import Link from "next/link";

interface GameItem {
  id: string;
  name: string;
  image: string;
  auctionEndDate: string | null;
  auctionFile: string | null;
}

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  qrCodeUrl: string | null;
  accountType: string;
}

interface AuctionBid {
  id: string;
  gameItemId: string;
  gameItem: GameItem;
  amount: number;
  status: string;
  slipImage: string | null;
  adminSlipImage: string | null;
  downloadFile: string | null;
  createdAt: string;
}

export default function MyAuctionsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [bids, setBids] = useState<AuctionBid[]>([]);
  const [showSlipPreview, setShowSlipPreview] = useState(false);
  const [slipPreviewUrl, setSlipPreviewUrl] = useState<string | null>(null);

  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [payingBid, setPayingBid] = useState<AuctionBid | null>(null);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [selectedBankAccount, setSelectedBankAccount] = useState<BankAccount | null>(null);
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyerBankAccount, setBuyerBankAccount] = useState("");
  const [slipImage, setSlipImage] = useState<string | null>(null);
  const [uploadingSlip, setUploadingSlip] = useState(false);
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [paymentResult, setPaymentResult] = useState<{ success: boolean; message: string } | null>(null);

  // Payment method category
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "card" | "bitcoin">("bank");
  // Card details
  const [cardType, setCardType] = useState<"visa" | "mastercard">("visa");
  const [cardBankName, setCardBankName] = useState("");
  const [cardLast4, setCardLast4] = useState("");

  useEffect(() => {
    fetch("/api/auction-bids")
      .then(res => {
        if (res.status === 401) {
          router.push("/auth");
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          setBids(data.bids || []);
        }
      })
      .catch(err => {
        console.error("Error fetching bids:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  const openPaymentModal = async (bid: AuctionBid) => {
    setPayingBid(bid);
    setSlipImage(null);
    setSelectedBankAccount(null);
    setPaymentResult(null);
    setPaymentMethod("bank");
    setCardType("visa");
    setCardBankName("");
    setCardLast4("");
    setShowPaymentModal(true);

    // Fetch bank accounts
    try {
      const res = await fetch("/api/bank-accounts");
      const data = await res.json();
      if (data.success) {
        setBankAccounts(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching bank accounts:", err);
    }

    // Fetch user profile to pre-fill
    try {
      const res = await fetch("/api/user/profile");
      const data = await res.json();
      if (data.success && data.user) {
        setBuyerName(data.user.fullName || "");
        setBuyerPhone(data.user.phone || "");
        setBuyerBankAccount(data.user.bankAccountTransfer || "");
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  const handleSlipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingSlip(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload-slip", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setSlipImage(data.url);
      } else {
        alert(data.error || "ไม่สามารถอัปโหลดสลิปได้");
      }
    } catch {
      alert("เกิดข้อผิดพลาดในการอัปโหลดสลิป");
    } finally {
      setUploadingSlip(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!payingBid) return;

    // Validate based on payment method
    if (paymentMethod === "bank") {
      if (!selectedBankAccount) {
        setPaymentResult({ success: false, message: "กรุณาเลือกบัญชีธนาคารที่โอน" });
        return;
      }
    } else if (paymentMethod === "card") {
      if (!cardBankName.trim()) {
        setPaymentResult({ success: false, message: "กรุณากรอกชื่อธนาคารของบัตร" });
        return;
      }
      if (!cardLast4.trim() || cardLast4.length !== 4) {
        setPaymentResult({ success: false, message: "กรุณากรอกเลขท้าย 4 ตัวของบัตร" });
        return;
      }
    } else if (paymentMethod === "bitcoin") {
      if (!selectedBankAccount) {
        setPaymentResult({ success: false, message: "กรุณาเลือก Wallet ที่โอน" });
        return;
      }
    }

    if (!buyerName.trim()) {
      setPaymentResult({ success: false, message: "กรุณากรอกชื่อ-นามสกุล" });
      return;
    }
    if (!buyerPhone.trim()) {
      setPaymentResult({ success: false, message: "กรุณากรอกเบอร์โทรศัพท์" });
      return;
    }

    setSubmittingPayment(true);
    setPaymentResult(null);

    try {
      // Build payment info string
      let paymentInfo = "";
      if (paymentMethod === "bank") {
        paymentInfo = `โอนบัญชี: ${selectedBankAccount?.bankName} | ชื่อ: ${buyerName} | เบอร์: ${buyerPhone} | บัญชีผู้โอน: ${buyerBankAccount}`;
      } else if (paymentMethod === "card") {
        paymentInfo = `บัตร${cardType === "visa" ? "Visa" : "Mastercard"}: ${cardBankName} เลขท้าย ${cardLast4} | ชื่อ: ${buyerName} | เบอร์: ${buyerPhone}`;
      } else if (paymentMethod === "bitcoin") {
        paymentInfo = `Bitcoin: ${selectedBankAccount?.bankName} | ชื่อ: ${buyerName} | เบอร์: ${buyerPhone}`;
      }

      const res = await fetch(`/api/auction-bids/${payingBid.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slipImage: slipImage || paymentInfo }),
      });
      const data = await res.json();
      if (data.success) {
        setBids(prev => prev.map(b => b.id === payingBid.id ? { ...b, slipImage: slipImage || paymentInfo, status: "PAID" } : b));
        setPaymentResult({ success: true, message: "ชำระเงินสำเร็จ! รอแอดมินตรวจสอบ" });
        setTimeout(() => {
          setShowPaymentModal(false);
          setPayingBid(null);
        }, 2000);
      } else {
        setPaymentResult({ success: false, message: data.error || "เกิดข้อผิดพลาด" });
      }
    } catch {
      setPaymentResult({ success: false, message: "เกิดข้อผิดพลาด" });
    } finally {
      setSubmittingPayment(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "WON":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Trophy className="w-3 h-3 mr-1" />
            ชนะ - รอชำระเงิน
          </span>
        );
      case "PAID":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <ImageIcon className="w-3 h-3 mr-1" />
            แนบสลิปแล้ว - รอตรวจสอบ
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            เสร็จสิ้น
          </span>
        );
      case "LOST":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-500/20 text-gray-400 border border-gray-500/30">
            <XCircle className="w-3 h-3 mr-1" />
            ไม่ชนะ
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3 mr-1" />
            รอผลประมูล
          </span>
        );
    }
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  // Calculate stats
  const stats = {
    total: bids.length,
    pending: bids.filter(b => b.status === "PENDING").length,
    won: bids.filter(b => b.status === "WON").length,
    lost: bids.filter(b => b.status === "LOST").length,
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 [background:radial-gradient(600px_400px_at_50%_0%,rgba(245,158,11,0.15),transparent_60%),radial-gradient(520px_360px_at_50%_100%,rgba(234,179,8,0.15),transparent_60%)] opacity-50"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            กลับไปแดชบอร์ด
          </Link>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mr-4 border border-amber-500/30">
              <Gavel className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                การประมูลของฉัน
              </h1>
              <p className="text-gray-400 text-sm">
                รายการประมูลทั้งหมดของคุณ
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
            <p className="text-xs text-gray-400 mb-1">ทั้งหมด</p>
            <p className="text-xl font-bold text-white">
              {loading ? <span className="inline-block w-8 h-6 bg-white/10 rounded animate-pulse" /> : stats.total}
            </p>
          </div>
          
          <div className="bg-amber-500/10 backdrop-blur-xl rounded-xl p-4 border border-amber-500/20">
            <p className="text-xs text-amber-300 mb-1">รอผล</p>
            <p className="text-xl font-bold text-amber-400">
              {loading ? <span className="inline-block w-8 h-6 bg-amber-500/20 rounded animate-pulse" /> : stats.pending}
            </p>
          </div>
          
          <div className="bg-green-500/10 backdrop-blur-xl rounded-xl p-4 border border-green-500/20">
            <p className="text-xs text-green-300 mb-1">ชนะ</p>
            <p className="text-xl font-bold text-green-400">
              {loading ? <span className="inline-block w-8 h-6 bg-green-500/20 rounded animate-pulse" /> : stats.won}
            </p>
          </div>
          
          <div className="bg-gray-500/10 backdrop-blur-xl rounded-xl p-4 border border-gray-500/20">
            <p className="text-xs text-gray-400 mb-1">ไม่ชนะ</p>
            <p className="text-xl font-bold text-gray-400">
              {loading ? <span className="inline-block w-8 h-6 bg-gray-500/20 rounded animate-pulse" /> : stats.lost}
            </p>
          </div>
        </div>

        {/* Bids List */}
        <div className="space-y-4">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/10 rounded-lg animate-pulse" />
                  <div className="flex-1">
                    <div className="h-5 bg-white/10 rounded animate-pulse w-1/3 mb-2" />
                    <div className="h-4 bg-white/10 rounded animate-pulse w-1/4" />
                  </div>
                </div>
              </div>
            ))
          ) : bids.length > 0 ? (
            bids.map((bid) => (
              <div 
                key={bid.id} 
                className={`bg-white/5 backdrop-blur-xl rounded-xl p-4 border transition-all ${
                  bid.status === "WON" 
                    ? "border-green-500/30 bg-green-500/5" 
                    : bid.status === "LOST"
                    ? "border-gray-500/20"
                    : "border-amber-500/20"
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Product Image */}
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center overflow-hidden flex-shrink-0 border border-amber-500/20">
                    {bid.gameItem?.image ? (
                      <img src={bid.gameItem.image} alt={bid.gameItem.name} className="w-full h-full object-cover" />
                    ) : (
                      <Gavel className="w-6 h-6 text-amber-400" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate mb-1">
                      {bid.gameItem?.name || "สินค้าไม่ทราบชื่อ"}
                    </h3>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-amber-400 font-bold">฿{bid.amount.toFixed(0)}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-400 text-xs">{formatDate(bid.createdAt)}</span>
                    </div>
                    {bid.gameItem?.auctionEndDate && (
                      <p className="text-xs text-gray-500 mt-1">
                        จบประมูล: {formatDate(bid.gameItem.auctionEndDate)}
                      </p>
                    )}
                  </div>

                  {/* Status */}
                  <div className="flex-shrink-0">
                    {getStatusBadge(bid.status)}
                  </div>
                </div>

                {/* WON - Payment Button */}
                {bid.status === "WON" && (
                  <div className="mt-3 pt-3 border-t border-amber-500/20 space-y-3">
                    <p className="text-sm text-amber-400 flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      ยินดีด้วย! คุณชนะการประมูลสินค้านี้ กรุณาชำระเงิน
                    </p>
                    <button
                      onClick={() => openPaymentModal(bid)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg font-semibold hover:from-amber-700 hover:to-orange-700 transition-all"
                    >
                      <Building2 className="w-5 h-5" />
                      ชำระเงิน
                    </button>
                  </div>
                )}

                {/* PAID - Waiting for admin */}
                {bid.status === "PAID" && (
                  <div className="mt-3 pt-3 border-t border-blue-500/20 space-y-3">
                    <p className="text-sm text-blue-400 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      แนบสลิปแล้ว รอแอดมินตรวจสอบและส่งไฟล์ให้คุณ
                    </p>
                    {bid.slipImage && (
                      <img
                        src={bid.slipImage}
                        alt="สลิปของคุณ"
                        className="w-full max-w-[180px] rounded-lg border border-blue-500/30 cursor-pointer hover:opacity-80"
                        onClick={() => {
                          setSlipPreviewUrl(bid.slipImage);
                          setShowSlipPreview(true);
                        }}
                      />
                    )}
                  </div>
                )}

                {/* COMPLETED - Show admin slip + download button */}
                {bid.status === "COMPLETED" && (
                  <div className="mt-3 pt-3 border-t border-green-500/20 space-y-3">
                    <p className="text-sm text-green-400 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      แอดมินยืนยันการชำระเงินเรียบร้อยแล้ว
                    </p>

                    {/* Admin Slip */}
                    {bid.adminSlipImage && (
                      <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                        <p className="text-xs text-green-400 mb-2 flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" />
                          สลิปการโอนเงินจากแอดมิน
                        </p>
                        <img
                          src={bid.adminSlipImage}
                          alt="Admin Slip"
                          className="w-full max-w-[180px] rounded-lg border border-green-500/30 cursor-pointer hover:opacity-80"
                          onClick={() => {
                            setSlipPreviewUrl(bid.adminSlipImage);
                            setShowSlipPreview(true);
                          }}
                        />
                      </div>
                    )}

                    {/* Download File - from bid.downloadFile or gameItem.auctionFile */}
                    {(bid.downloadFile || bid.gameItem?.auctionFile) && (
                      <a
                        href={`/api/download?url=${encodeURIComponent((bid.downloadFile || bid.gameItem?.auctionFile)!)}`}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                      >
                        <Download className="w-5 h-5" />
                        ดาวน์โหลดไฟล์
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-12 border border-white/10 text-center">
              <Gavel className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">คุณยังไม่มีรายการประมูล</p>
              <Link 
                href="/"
                className="text-amber-400 hover:text-amber-300 text-sm font-medium"
              >
                ไปดูสินค้าประมูล →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && payingBid && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-white">ชำระเงินค่าประมูล</h2>
                <button
                  onClick={() => { setShowPaymentModal(false); setPayingBid(null); }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Order Summary */}
              <div className="bg-white/5 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  {payingBid.gameItem?.image ? (
                    <img src={payingBid.gameItem.image} alt={payingBid.gameItem.name} className="w-12 h-12 rounded-lg object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-amber-500/20 flex items-center justify-center">
                      <Gavel className="w-6 h-6 text-amber-400" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-white">{payingBid.gameItem?.name}</p>
                    <p className="text-amber-400 font-bold">฿{payingBid.amount.toFixed(0)}</p>
                  </div>
                </div>
              </div>

              {/* Payment Method Tabs */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-white mb-3">เลือกวิธีการชำระเงิน</h3>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => { setPaymentMethod("bank"); setSelectedBankAccount(null); }}
                    className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-lg border-2 transition-all text-xs font-medium ${
                      paymentMethod === "bank"
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                        : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20"
                    }`}
                  >
                    <Building2 className="w-5 h-5" />
                    โอนบัญชี
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPaymentMethod("card"); setSelectedBankAccount(null); }}
                    className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-lg border-2 transition-all text-xs font-medium ${
                      paymentMethod === "card"
                        ? "border-blue-500 bg-blue-500/10 text-blue-400"
                        : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20"
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    บัตรเครดิต/เดบิต
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPaymentMethod("bitcoin"); setSelectedBankAccount(null); }}
                    className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-lg border-2 transition-all text-xs font-medium ${
                      paymentMethod === "bitcoin"
                        ? "border-orange-500 bg-orange-500/10 text-orange-400"
                        : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20"
                    }`}
                  >
                    <Bitcoin className="w-5 h-5" />
                    Bitcoin
                  </button>
                </div>
              </div>

              {/* === BANK TRANSFER === */}
              {paymentMethod === "bank" && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-400" />
                    เลือกบัญชีธนาคาร <span className="text-red-400">*</span>
                  </h3>
                  {bankAccounts.filter(b => b.accountType !== "bitcoin").length > 0 ? (
                    <div className="space-y-3">
                      {bankAccounts.filter(b => b.accountType !== "bitcoin").map((bank) => (
                        <div
                          key={bank.id}
                          onClick={() => setSelectedBankAccount(bank)}
                          className={`cursor-pointer rounded-lg p-3 transition-all ${
                            selectedBankAccount?.id === bank.id
                              ? "bg-emerald-500/20 border-2 border-emerald-500"
                              : "bg-white/5 border border-white/10 hover:border-emerald-500/50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              selectedBankAccount?.id === bank.id
                                ? "border-emerald-500 bg-emerald-500"
                                : "border-gray-500"
                            }`}>
                              {selectedBankAccount?.id === bank.id && (
                                <CheckCircle className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-emerald-400">{bank.bankName}</p>
                              <p className="text-white text-lg font-mono">{bank.accountNumber}</p>
                              <p className="text-gray-400 text-sm">{bank.accountName}</p>
                            </div>
                          </div>
                          {selectedBankAccount?.id === bank.id && bank.qrCodeUrl && (
                            <div className="mt-3 pt-3 border-t border-emerald-500/20">
                              <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                                <Building2 className="w-3 h-3" />
                                สแกน QR Code เพื่อโอนเงิน
                              </p>
                              <img
                                src={bank.qrCodeUrl}
                                alt="QR Code"
                                className="w-full max-w-[200px] mx-auto rounded-lg bg-white p-2"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">กำลังโหลดข้อมูลบัญชี...</p>
                  )}
                </div>
              )}

              {/* === CREDIT/DEBIT CARD === */}
              {paymentMethod === "card" && (
                <div className="mb-6 space-y-4">
                  {/* Card Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      ประเภทบัตร <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setCardType("visa")}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all font-semibold ${
                          cardType === "visa"
                            ? "border-blue-500 bg-blue-500/10 text-blue-400"
                            : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20"
                        }`}
                      >
                        <span className="text-lg">💳</span>
                        Visa
                      </button>
                      <button
                        type="button"
                        onClick={() => setCardType("mastercard")}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all font-semibold ${
                          cardType === "mastercard"
                            ? "border-orange-500 bg-orange-500/10 text-orange-400"
                            : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20"
                        }`}
                      >
                        <span className="text-lg">💳</span>
                        Mastercard
                      </button>
                    </div>
                  </div>

                  {/* Card Bank Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      ชื่อธนาคารของบัตร <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={cardBankName}
                      onChange={(e) => setCardBankName(e.target.value)}
                      placeholder="เช่น กสิกรไทย, กรุงเทพ, ไทยพาณิชย์"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Last 4 Digits */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      เลขท้าย 4 ตัวของบัตร <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={cardLast4}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                        setCardLast4(val);
                      }}
                      placeholder="xxxx"
                      maxLength={4}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-lg tracking-widest"
                    />
                  </div>
                </div>
              )}

              {/* === BITCOIN === */}
              {paymentMethod === "bitcoin" && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <Bitcoin className="w-4 h-4 text-orange-400" />
                    เลือก Wallet ที่ต้องการโอน <span className="text-red-400">*</span>
                  </h3>
                  {bankAccounts.filter(b => b.accountType === "bitcoin").length > 0 ? (
                    <div className="space-y-3">
                      {bankAccounts.filter(b => b.accountType === "bitcoin").map((wallet) => (
                        <div
                          key={wallet.id}
                          onClick={() => setSelectedBankAccount(wallet)}
                          className={`cursor-pointer rounded-lg p-3 transition-all ${
                            selectedBankAccount?.id === wallet.id
                              ? "bg-orange-500/20 border-2 border-orange-500"
                              : "bg-white/5 border border-white/10 hover:border-orange-500/50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              selectedBankAccount?.id === wallet.id
                                ? "border-orange-500 bg-orange-500"
                                : "border-gray-500"
                            }`}>
                              {selectedBankAccount?.id === wallet.id && (
                                <CheckCircle className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-orange-400">{wallet.bankName}</p>
                              <p className="text-white text-sm font-mono break-all">{wallet.accountNumber}</p>
                              <p className="text-gray-400 text-sm">{wallet.accountName}</p>
                            </div>
                          </div>
                          {selectedBankAccount?.id === wallet.id && wallet.qrCodeUrl && (
                            <div className="mt-3 pt-3 border-t border-orange-500/20">
                              <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                                <Bitcoin className="w-3 h-3" />
                                สแกน QR Code เพื่อโอน
                              </p>
                              <img
                                src={wallet.qrCodeUrl}
                                alt="QR Code"
                                className="w-full max-w-[200px] mx-auto rounded-lg bg-white p-2"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg text-center">
                      <Bitcoin className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                      <p className="text-sm text-orange-300">ยังไม่มี Bitcoin Wallet</p>
                      <p className="text-xs text-gray-400 mt-1">กรุณาติดต่อแอดมิน</p>
                    </div>
                  )}
                </div>
              )}

              {/* Buyer Info Form */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    ชื่อ-นามสกุล <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="ชื่อ นามสกุล"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    เบอร์โทรศัพท์ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="0xx-xxx-xxxx"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                {/* Bank account number - only for bank transfer */}
                {paymentMethod === "bank" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      เลขบัญชีผู้โอน
                    </label>
                    <input
                      type="text"
                      value={buyerBankAccount}
                      onChange={(e) => setBuyerBankAccount(e.target.value)}
                      placeholder="เลขบัญชีที่ใช้โอนเงิน"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                )}

                {/* Slip Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    แนบสลิป/หลักฐานการชำระเงิน
                  </label>
                  {slipImage ? (
                    <div className="relative">
                      <img src={slipImage} alt="Slip" className="w-full h-48 object-contain rounded-lg bg-white/5" />
                      <button
                        onClick={() => setSlipImage(null)}
                        className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-amber-500/50 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleSlipUpload}
                        className="hidden"
                        disabled={uploadingSlip}
                      />
                      {uploadingSlip ? (
                        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-400">คลิกเพื่ออัปโหลดสลิป/หลักฐาน</p>
                        </>
                      )}
                    </label>
                  )}
                </div>
              </div>

              {/* Result Message */}
              {paymentResult && (
                <div
                  className={`mb-4 p-4 rounded-lg flex items-start gap-3 ${
                    paymentResult.success
                      ? "bg-green-500/10 border border-green-500/20"
                      : "bg-red-500/10 border border-red-500/20"
                  }`}
                >
                  {paymentResult.success ? (
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <p className={`text-sm font-medium ${paymentResult.success ? "text-green-400" : "text-red-400"}`}>
                    {paymentResult.message}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowPaymentModal(false); setPayingBid(null); }}
                  disabled={submittingPayment}
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 text-gray-200 hover:bg-white/15 transition-colors disabled:opacity-50"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleConfirmPayment}
                  disabled={submittingPayment || paymentResult?.success}
                  className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold hover:from-amber-700 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submittingPayment ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      กำลังดำเนินการ...
                    </>
                  ) : paymentResult?.success ? (
                    "สำเร็จ"
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      ยืนยันการชำระเงิน
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Slip Preview Modal */}
      {showSlipPreview && slipPreviewUrl && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4 cursor-pointer"
          onClick={() => setShowSlipPreview(false)}
        >
          <div className="max-w-2xl w-full max-h-[90vh] overflow-auto">
            <img src={slipPreviewUrl} alt="สลิป" className="w-full rounded-lg" />
            <p className="text-center text-gray-400 text-sm mt-3">คลิกเพื่อปิด</p>
          </div>
        </div>
      )}
    </div>
  );
}
