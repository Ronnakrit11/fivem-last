"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Crown, ShoppingBag, X, CheckCircle, AlertCircle, Loader2, Building2, Upload, Image as ImageIcon } from "lucide-react";

interface GameItem {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  isCustomPrice: boolean;
  stock: number;
  isUnlimitedStock: boolean;
  isAuction: boolean;
  auctionEndDate: string | null;
  isActive: boolean;
}

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  qrCodeUrl: string | null;
}

export default function HomeGameItems({ items }: { items: GameItem[] }) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GameItem | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  
  // Step 2: Payment modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyerBankAccount, setBuyerBankAccount] = useState("");
  const [slipImage, setSlipImage] = useState<string | null>(null);
  const [uploadingSlip, setUploadingSlip] = useState(false);

  // Check login status
  useEffect(() => {
    fetch("/api/auth/get-session", {
      method: "GET",
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setIsLoggedIn(!!data.session || !!data.user))
      .catch(() => setIsLoggedIn(false));
  }, []);

  const handleItemClick = (item: GameItem) => {
    // Check if out of stock (not for auction items)
    if (!item.isAuction && !item.isUnlimitedStock && item.stock <= 0) {
      alert("สินค้าหมด");
      return;
    }

    // Check if auction has ended
    if (item.isAuction && item.auctionEndDate && new Date(item.auctionEndDate) < new Date()) {
      alert("การประมูลสิ้นสุดแล้ว");
      return;
    }
    
    if (!isLoggedIn) {
      const action = item.isAuction ? "ประมูล" : "สั่งซื้อ";
      if (confirm(`คุณต้องเข้าสู่ระบบก่อน${action} "${item.name}"\n\nต้องการไปหน้า Login หรือไม่?`)) {
        router.push("/auth");
      }
      return;
    }
    setSelectedItem(item);
    setCustomAmount("");
    setResult(null);
    setShowModal(true);
  };

  // Fetch bank accounts for payment modal
  const fetchBankAccounts = async () => {
    try {
      const res = await fetch("/api/bank-accounts");
      const data = await res.json();
      if (data.success) {
        setBankAccounts(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching bank accounts:", error);
    }
  };

  // Handle slip upload
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
        alert(data.error || "ไม่สามารถอัพโหลดสลิปได้");
      }
    } catch (error) {
      console.error("Error uploading slip:", error);
      alert("เกิดข้อผิดพลาดในการอัพโหลดสลิป");
    } finally {
      setUploadingSlip(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedItem) return;

    // Validate amount for custom price or auction
    if ((selectedItem.isCustomPrice || selectedItem.isAuction) && (!customAmount || parseFloat(customAmount) <= 0)) {
      const msg = selectedItem.isAuction ? "กรุณาระบุจำนวนเงินที่ต้องการประมูล" : "กรุณาระบุจำนวนเงินที่ต้องการซื้อ";
      setResult({ success: false, message: msg });
      return;
    }

    // For auction items, submit directly
    if (selectedItem.isAuction) {
      setLoading(true);
      setResult(null);
      try {
        const res = await fetch("/api/auction-bids", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gameItemId: selectedItem.id,
            amount: parseFloat(customAmount),
          }),
        });

        const data = await res.json();
        if (data.success) {
          setResult({ success: true, message: "ประมูลสำเร็จ! รอแอดมินอนุมัติ" });
          setTimeout(() => {
            setShowModal(false);
            router.push("/my-auctions");
          }, 2000);
        } else {
          setResult({ success: false, message: data.error || "เกิดข้อผิดพลาด" });
        }
      } catch {
        setResult({ success: false, message: "เกิดข้อผิดพลาด" });
      } finally {
        setLoading(false);
      }
      return;
    }

    // For regular items, show payment modal
    setShowModal(false);
    fetchBankAccounts();
    setBuyerName("");
    setBuyerPhone("");
    setBuyerBankAccount("");
    setSlipImage(null);
    setResult(null);
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = async () => {
    if (!selectedItem) return;

    // Validate buyer info
    if (!buyerName.trim()) {
      setResult({ success: false, message: "กรุณากรอกชื่อ-นามสกุล" });
      return;
    }
    if (!buyerPhone.trim()) {
      setResult({ success: false, message: "กรุณากรอกเบอร์โทรศัพท์" });
      return;
    }
    if (!buyerBankAccount.trim()) {
      setResult({ success: false, message: "กรุณากรอกเลขบัญชีผู้โอน" });
      return;
    }
    if (!slipImage) {
      setResult({ success: false, message: "กรุณาแนบสลิปการโอนเงิน" });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/game-item-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameItemId: selectedItem.id,
          amount: selectedItem.isCustomPrice ? parseFloat(customAmount) : selectedItem.price,
          buyerName: buyerName.trim(),
          buyerPhone: buyerPhone.trim(),
          buyerBankAccount: buyerBankAccount.trim(),
          slipImage,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setResult({ success: true, message: "สั่งซื้อสำเร็จ! รอแอดมินอนุมัติ" });
        setTimeout(() => {
          setShowPaymentModal(false);
          router.push("/app-history");
        }, 2000);
      } else {
        setResult({ success: false, message: data.error || "เกิดข้อผิดพลาด" });
      }
    } catch {
      setResult({ success: false, message: "เกิดข้อผิดพลาด" });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">ไม่พบสินค้า</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => handleItemClick(item)}
            className="rounded-xl overflow-hidden flex flex-col transition-all bg-slate-900/80 shadow-md hover:shadow-lg hover:scale-[1.02] group cursor-pointer"
          >
            {/* Product Image */}
            <div className="relative aspect-square bg-gradient-to-br from-purple-900/30 to-indigo-900/30">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag className="w-12 h-12 text-purple-400/50" />
                </div>
              )}
              {/* Badge */}
              {item.isAuction ? (
                <div className="absolute top-1 left-1 bg-amber-500 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                  🔨 ประมูล
                </div>
              ) : item.isUnlimitedStock ? (
                <div className="absolute top-1 left-1 bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                  ไม่จำกัด
                </div>
              ) : item.stock > 0 ? (
                <div className="absolute top-1 left-1 bg-purple-600 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                  คงเหลือ {item.stock}
                </div>
              ) : (
                <div className="absolute top-1 left-1 bg-red-500 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                  สินค้าหมด
                </div>
              )}
              {/* Label */}
              <div className={`absolute bottom-0 left-0 right-0 text-white text-[10px] font-bold text-center py-1 ${item.isAuction ? 'bg-amber-600' : 'bg-purple-600'}`}>
                {item.isAuction ? 'AUCTION' : 'APP PREMIUM'}
              </div>
            </div>

            {/* Product Info */}
            <div className="p-3 flex flex-col flex-grow">
              <h3 className="text-sm font-bold text-white mb-1 line-clamp-2 min-h-[2.5rem] group-hover:text-purple-300 transition-colors">
                {item.name}
              </h3>

              {/* Pricing */}
              <div className="mb-2 mt-auto">
                <div className="flex items-baseline justify-between">
                  <span className="text-[10px] text-gray-400">{item.isAuction ? 'ประมูล:' : 'ราคา:'}</span>
                  {item.isAuction ? (
                    <span className="text-xs font-medium text-amber-400">
                      เสนอราคา
                    </span>
                  ) : item.isCustomPrice ? (
                    <span className="text-xs font-medium text-orange-400">
                      แล้วแต่ลูกค้าสั่ง
                    </span>
                  ) : (
                    <span className="text-base font-bold text-green-400">
                      ฿{item.price.toFixed(0)}
                    </span>
                  )}
                </div>
                {item.isAuction && item.auctionEndDate && (
                  <div className="text-[10px] text-amber-300 mt-1">
                    จบ: {new Date(item.auctionEndDate).toLocaleString('th-TH')}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className={`w-full py-1.5 rounded-md font-semibold transition-colors flex items-center justify-center text-xs ${item.isAuction ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 group-hover:bg-amber-500/30' : 'bg-purple-500/20 text-purple-300 border border-purple-500/50 group-hover:bg-purple-500/30'}`}>
                <ShoppingBag className="w-3 h-3 mr-1" />
                {item.isAuction ? 'ประมูล' : 'สั่งซื้อ'}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => router.push("/dashboard")}
          className="inline-flex items-center px-6 py-3 border border-purple-500/40 text-base font-medium rounded-lg text-purple-400 bg-gradient-to-r from-neutral-900 to-black hover:from-neutral-800 hover:to-neutral-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
        >
          <Crown className="w-5 h-5 mr-2" />
          ดูประวัติการสั่งซื้อ
        </button>
      </div>

      {/* Purchase Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-white">
                  {selectedItem.isAuction ? '🔨 ประมูลสินค้า' : 'รายละเอียดสินค้า'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Product Image */}
              <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-purple-900/30 to-indigo-900/30">
                {selectedItem.image ? (
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="w-16 h-16 text-purple-400/50" />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {selectedItem.name}
                </h3>
                <p className="text-sm text-gray-300 mb-4 whitespace-pre-line">
                  {selectedItem.description || "ไม่มีคำอธิบาย"}
                </p>

                {/* Price Display */}
                {selectedItem.isAuction ? (
                  <div className="space-y-3">
                    <div className="py-3 px-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                      <p className="text-sm text-amber-400 mb-2">🔨 สินค้าประมูล</p>
                      <p className="text-xs text-gray-400">กรุณาระบุจำนวนเงินที่ต้องการประมูล</p>
                      {selectedItem.auctionEndDate && (
                        <p className="text-xs text-amber-300 mt-2">
                          จบประมูล: {new Date(selectedItem.auctionEndDate).toLocaleString('th-TH')}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        จำนวนเงินประมูล (บาท) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        placeholder="ระบุจำนวนเงินที่ต้องการประมูล"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                ) : selectedItem.isCustomPrice ? (
                  <div className="space-y-3">
                    <div className="py-3 px-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                      <p className="text-sm text-orange-400 mb-2">ราคาสินค้าแล้วแต่ลูกค้าสั่ง</p>
                      <p className="text-xs text-gray-400">กรุณาระบุจำนวนเงินที่ต้องการซื้อ</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        จำนวนเงิน (บาท) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        placeholder="ระบุจำนวนเงิน"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between py-3 px-4 bg-white/5 rounded-lg">
                    <span className="text-gray-300">ราคา</span>
                    <span className="text-2xl font-bold text-green-400">
                      ฿{selectedItem.price.toFixed(0)}
                    </span>
                  </div>
                )}

              </div>

              {/* Result Message */}
              {result && (
                <div
                  className={`mb-4 p-4 rounded-lg flex items-start gap-3 ${
                    result.success
                      ? "bg-green-500/10 border border-green-500/20"
                      : "bg-red-500/10 border border-red-500/20"
                  }`}
                >
                  {result.success ? (
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <p className={`text-sm font-medium ${result.success ? "text-green-400" : "text-red-400"}`}>
                    {result.message}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 text-gray-200 hover:bg-white/15 transition-colors disabled:opacity-50"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handlePurchase}
                  disabled={loading || result?.success}
                  className={`flex-1 px-4 py-3 rounded-lg text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                    selectedItem.isAuction 
                      ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700' 
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {selectedItem.isAuction ? 'กำลังประมูล...' : 'กำลังสั่งซื้อ...'}
                    </>
                  ) : result?.success ? (
                    "สำเร็จ"
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      {selectedItem.isAuction ? 'ยืนยันประมูล' : 'ยืนยันสั่งซื้อ'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedItem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-white">ข้อมูลการชำระเงิน</h2>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Order Summary */}
              <div className="bg-white/5 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  {selectedItem.image ? (
                    <img src={selectedItem.image} alt={selectedItem.name} className="w-12 h-12 rounded-lg object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-purple-400" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-white">{selectedItem.name}</p>
                    <p className="text-green-400 font-bold">
                      ฿{selectedItem.isCustomPrice ? parseFloat(customAmount).toFixed(0) : selectedItem.price.toFixed(0)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bank Accounts */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  โอนเงินไปที่บัญชี
                </h3>
                {bankAccounts.length > 0 ? (
                  <div className="space-y-3">
                    {bankAccounts.map((bank) => (
                      <div key={bank.id} className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                        <p className="font-semibold text-emerald-400">{bank.bankName}</p>
                        <p className="text-white text-lg font-mono">{bank.accountNumber}</p>
                        <p className="text-gray-400 text-sm">{bank.accountName}</p>
                        {bank.qrCodeUrl && (
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
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    เลขบัญชีผู้โอน <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={buyerBankAccount}
                    onChange={(e) => setBuyerBankAccount(e.target.value)}
                    placeholder="เลขบัญชีที่ใช้โอนเงิน"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Slip Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    แนบสลิปการโอนเงิน <span className="text-red-500">*</span>
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
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-purple-500/50 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleSlipUpload}
                        className="hidden"
                        disabled={uploadingSlip}
                      />
                      {uploadingSlip ? (
                        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-400">คลิกเพื่ออัพโหลดสลิป</p>
                        </>
                      )}
                    </label>
                  )}
                </div>
              </div>

              {/* Result Message */}
              {result && (
                <div
                  className={`mb-4 p-4 rounded-lg flex items-start gap-3 ${
                    result.success
                      ? "bg-green-500/10 border border-green-500/20"
                      : "bg-red-500/10 border border-red-500/20"
                  }`}
                >
                  {result.success ? (
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <p className={`text-sm font-medium ${result.success ? "text-green-400" : "text-red-400"}`}>
                    {result.message}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  disabled={loading}
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 text-gray-200 hover:bg-white/15 transition-colors disabled:opacity-50"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleConfirmPayment}
                  disabled={loading || result?.success}
                  className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      กำลังดำเนินการ...
                    </>
                  ) : result?.success ? (
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
    </>
  );
}
