"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Package, ShoppingCart, X, CheckCircle, AlertCircle, Loader2, Building2, Upload, Shield, Plus, Minus, Trash2, CreditCard, Bitcoin } from "lucide-react";

interface RealProduct {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  stock: number;
  isActive: boolean;
}

interface CartItem {
  product: RealProduct;
  quantity: number;
}

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  qrCodeUrl: string | null;
  accountType: string;
}

interface PurchasePolicy {
  id: string;
  title: string;
  content: string;
}

export default function HomeRealProducts({ items }: { items: RealProduct[] }) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  // Payment form
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [selectedBankAccount, setSelectedBankAccount] = useState<BankAccount | null>(null);
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyerAddress, setBuyerAddress] = useState("");
  const [buyerBankAccount, setBuyerBankAccount] = useState("");
  const [slipImage, setSlipImage] = useState<string | null>(null);
  const [uploadingSlip, setUploadingSlip] = useState(false);
  const [purchasePolicy, setPurchasePolicy] = useState<PurchasePolicy | null>(null);
  const [acceptedPurchasePolicy, setAcceptedPurchasePolicy] = useState(false);
  const [showPurchasePolicyModal, setShowPurchasePolicyModal] = useState(false);

  // Payment method category
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "card" | "bitcoin">("bank");
  // Card details
  const [cardType, setCardType] = useState<"visa" | "mastercard">("visa");
  const [cardBankName, setCardBankName] = useState("");
  const [cardLast4, setCardLast4] = useState("");
  // Bitcoin wallet
  const [bitcoinWallet, setBitcoinWallet] = useState("");

  useEffect(() => {
    fetch("/api/auth/get-session", { method: "GET", credentials: "include" })
      .then(res => res.json())
      .then(data => setIsLoggedIn(!!data.session || !!data.user))
      .catch(() => setIsLoggedIn(false));
  }, []);

  const addToCart = (product: RealProduct) => {
    if (!isLoggedIn) {
      if (confirm(`คุณต้องเข้าสู่ระบบก่อนสั่งซื้อ "${product.name}"\n\nต้องการไปหน้า Login หรือไม่?`)) {
        router.push("/auth");
      }
      return;
    }
    if (product.stock <= 0) {
      alert("สินค้าหมด");
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          alert(`สินค้า "${product.name}" มีสต๊อคเหลือ ${product.stock} ชิ้น`);
          return prev;
        }
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return item;
          if (newQty > item.product.stock) {
            alert(`สินค้า "${item.product.name}" มีสต๊อคเหลือ ${item.product.stock} ชิ้น`);
            return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      });
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const fetchBankAccounts = async () => {
    try {
      const res = await fetch("/api/bank-accounts");
      const data = await res.json();
      if (data.success) setBankAccounts(data.data || []);
    } catch (error) {
      console.error("Error fetching bank accounts:", error);
    }
  };

  const fetchPurchasePolicy = async () => {
    try {
      const res = await fetch("/api/purchase-policy");
      const data = await res.json();
      if (data.policy) setPurchasePolicy(data.policy);
    } catch (error) {
      console.error("Error fetching purchase policy:", error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const res = await fetch("/api/user/profile");
      const data = await res.json();
      if (data.success && data.user) {
        setBuyerName(data.user.fullName || "");
        setBuyerPhone(data.user.phone || "");
        setBuyerBankAccount(data.user.bankAccountTransfer || "");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleSlipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingSlip(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload-slip", { method: "POST", body: formData });
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

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setShowCart(false);
    fetchBankAccounts();
    fetchPurchasePolicy();
    fetchUserProfile();
    setSlipImage(null);
    setSelectedBankAccount(null);
    setAcceptedPurchasePolicy(false);
    setResult(null);
    setPaymentMethod("bank");
    setCardType("visa");
    setCardBankName("");
    setCardLast4("");
    setBitcoinWallet("");
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = async () => {
    // Validate based on payment method
    if (paymentMethod === "bank") {
      if (!selectedBankAccount) { setResult({ success: false, message: "กรุณาเลือกบัญชีธนาคารที่โอน" }); return; }
    } else if (paymentMethod === "card") {
      if (!cardBankName.trim()) { setResult({ success: false, message: "กรุณากรอกชื่อธนาคารของบัตร" }); return; }
      if (!cardLast4.trim() || cardLast4.length !== 4) { setResult({ success: false, message: "กรุณากรอกเลขท้าย 4 ตัวของบัตร" }); return; }
    } else if (paymentMethod === "bitcoin") {
      if (!selectedBankAccount) { setResult({ success: false, message: "กรุณาเลือก Wallet ที่โอน" }); return; }
      if (!bitcoinWallet.trim()) { setResult({ success: false, message: "กรุณากรอก Wallet ของคุณ" }); return; }
    }

    if (!buyerName.trim()) { setResult({ success: false, message: "กรุณากรอกชื่อ-นามสกุล" }); return; }
    if (!buyerPhone.trim()) { setResult({ success: false, message: "กรุณากรอกเบอร์โทรศัพท์" }); return; }
    if (!buyerAddress.trim()) { setResult({ success: false, message: "กรุณากรอกที่อยู่จัดส่ง" }); return; }
    if (paymentMethod === "bank" && !buyerBankAccount.trim()) { setResult({ success: false, message: "กรุณากรอกเลขบัญชีผู้โอน" }); return; }
    if (purchasePolicy && !acceptedPurchasePolicy) { setResult({ success: false, message: "กรุณายอมรับนโยบายการซื้อสินค้า" }); return; }

    setLoading(true);
    setResult(null);

    // Build payment method string
    let paymentMethodStr = "";
    if (paymentMethod === "bank") {
      paymentMethodStr = `โอนบัญชี: ${selectedBankAccount?.bankName} - ${selectedBankAccount?.accountNumber} | บัญชีผู้โอน: ${buyerBankAccount}`;
    } else if (paymentMethod === "card") {
      paymentMethodStr = `บัตร${cardType === "visa" ? "Visa" : "Mastercard"}: ${cardBankName} เลขท้าย ${cardLast4}`;
    } else if (paymentMethod === "bitcoin") {
      paymentMethodStr = `Bitcoin: ${selectedBankAccount?.bankName} | Wallet ลูกค้า: ${bitcoinWallet}`;
    }

    try {
      const res = await fetch("/api/real-product-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map(item => ({ productId: item.product.id, quantity: item.quantity })),
          buyerName: buyerName.trim(),
          buyerPhone: buyerPhone.trim(),
          buyerAddress: buyerAddress.trim(),
          buyerBankAccount: buyerBankAccount.trim(),
          selectedPaymentMethod: paymentMethodStr,
          slipImage,
          acceptedPurchasePolicy,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResult({ success: true, message: "สั่งซื้อสำเร็จ! รอแอดมินอนุมัติ" });
        setCart([]);
        setTimeout(() => {
          setShowPaymentModal(false);
          router.push("/real-product-history");
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

  if (items.length === 0) return null;

  return (
    <>
      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => addToCart(item)}
            className="rounded-xl overflow-hidden flex flex-col transition-all bg-slate-900/80 shadow-md hover:shadow-lg hover:scale-[1.02] group cursor-pointer"
          >
            <div className="relative aspect-square bg-gradient-to-br from-rose-900/30 to-pink-900/30">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-12 h-12 text-rose-400/50" />
                </div>
              )}
              {item.stock > 0 ? (
                <div className="absolute top-1 left-1 bg-green-600 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                  คงเหลือ {item.stock}
                </div>
              ) : (
                <div className="absolute top-1 left-1 bg-red-500 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                  สินค้าหมด
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 text-white text-[10px] font-bold text-center py-1 bg-rose-600">
                สินค้าบริษัท
              </div>
            </div>

            <div className="p-3 flex flex-col flex-grow">
              <h3 className="text-sm font-bold text-white mb-1 line-clamp-2 min-h-[2.5rem] group-hover:text-rose-300 transition-colors">
                {item.name}
              </h3>
              <div className="mb-2 mt-auto">
                <div className="flex items-baseline justify-between">
                  <span className="text-[10px] text-gray-400">ราคา:</span>
                  <span className="text-base font-bold text-green-400">฿{item.price.toFixed(0)}</span>
                </div>
              </div>
              <div className="w-full py-1.5 rounded-md font-semibold transition-colors flex items-center justify-center text-xs bg-rose-500/20 text-rose-300 border border-rose-500/50 group-hover:bg-rose-500/30">
                <ShoppingCart className="w-3 h-3 mr-1" />
                เพิ่มลงตะกร้า
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-24 right-4 z-40">
          <button
            onClick={() => setShowCart(true)}
            className="relative bg-gradient-to-r from-rose-600 to-pink-600 text-white p-4 rounded-full shadow-2xl hover:from-rose-700 hover:to-pink-700 transition-all hover:scale-110"
          >
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          </button>
        </div>
      )}

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  ตะกร้าสินค้า ({cartCount} ชิ้น)
                </h2>
                <button onClick={() => setShowCart(false)} className="text-gray-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400">ตะกร้าว่าง</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-6">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                          {item.product.image ? (
                            <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{item.product.name}</p>
                          <p className="text-xs text-green-400 font-bold">฿{item.product.price.toFixed(0)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, -1)}
                            disabled={item.quantity <= 1}
                            className="w-7 h-7 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 disabled:opacity-30"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-white font-bold text-sm w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="w-7 h-7 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="w-7 h-7 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/30 ml-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg mb-6">
                    <span className="text-white font-semibold">ยอดรวม</span>
                    <span className="text-2xl font-bold text-rose-400">฿{cartTotal.toFixed(0)}</span>
                  </div>

                  {/* Checkout Button */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowCart(false)}
                      className="flex-1 px-4 py-3 rounded-lg bg-white/10 text-gray-200 hover:bg-white/15 transition-colors"
                    >
                      ดูสินค้าต่อ
                    </button>
                    <button
                      onClick={handleCheckout}
                      className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold hover:from-rose-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      สั่งซื้อ
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-white">ข้อมูลการชำระเงิน</h2>
                <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Order Summary */}
              <div className="bg-white/5 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-semibold text-white mb-3">สรุปรายการสั่งซื้อ</h3>
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-center py-1.5 text-sm">
                    <span className="text-gray-300">{item.product.name} x{item.quantity}</span>
                    <span className="text-green-400 font-bold">฿{(item.product.price * item.quantity).toFixed(0)}</span>
                  </div>
                ))}
                <div className="border-t border-white/10 mt-2 pt-2 flex justify-between items-center">
                  <span className="text-white font-semibold">ยอดรวม</span>
                  <span className="text-lg font-bold text-rose-400">฿{cartTotal.toFixed(0)}</span>
                </div>
              </div>

              {/* Payment Method Tabs */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  เลือกวิธีการชำระเงิน <span className="text-red-400">*</span>
                </h3>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <button type="button" onClick={() => { setPaymentMethod("bank"); setSelectedBankAccount(null); }}
                    className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-lg border-2 transition-all text-xs font-medium ${paymentMethod === "bank" ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20"}`}>
                    <Building2 className="w-5 h-5" />
                    โอนบัญชี
                  </button>
                  <button type="button" onClick={() => { setPaymentMethod("card"); setSelectedBankAccount(null); }}
                    className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-lg border-2 transition-all text-xs font-medium ${paymentMethod === "card" ? "border-blue-500 bg-blue-500/10 text-blue-400" : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20"}`}>
                    <CreditCard className="w-5 h-5" />
                    บัตรเครดิต/เดบิต
                  </button>
                  <button type="button" onClick={() => { setPaymentMethod("bitcoin"); setSelectedBankAccount(null); }}
                    className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-lg border-2 transition-all text-xs font-medium ${paymentMethod === "bitcoin" ? "border-orange-500 bg-orange-500/10 text-orange-400" : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20"}`}>
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
                        <div key={bank.id} onClick={() => setSelectedBankAccount(bank)}
                          className={`cursor-pointer rounded-lg p-3 transition-all ${selectedBankAccount?.id === bank.id ? "bg-emerald-500/20 border-2 border-emerald-500" : "bg-white/5 border border-white/10 hover:border-emerald-500/50"}`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedBankAccount?.id === bank.id ? "border-emerald-500 bg-emerald-500" : "border-gray-500"}`}>
                              {selectedBankAccount?.id === bank.id && <CheckCircle className="w-3 h-3 text-white" />}
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
                              <img src={bank.qrCodeUrl} alt="QR Code" className="w-full max-w-[200px] mx-auto rounded-lg bg-white p-2" />
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
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">ประเภทบัตร <span className="text-red-500">*</span></label>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setCardType("visa")}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all font-semibold ${cardType === "visa" ? "border-blue-500 bg-blue-500/10 text-blue-400" : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20"}`}>
                        <span className="text-lg">💳</span> Visa
                      </button>
                      <button type="button" onClick={() => setCardType("mastercard")}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all font-semibold ${cardType === "mastercard" ? "border-orange-500 bg-orange-500/10 text-orange-400" : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20"}`}>
                        <span className="text-lg">💳</span> Mastercard
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">ชื่อธนาคารของบัตร <span className="text-red-500">*</span></label>
                    <input type="text" value={cardBankName} onChange={(e) => setCardBankName(e.target.value)} placeholder="เช่น กสิกรไทย, กรุงเทพ, ไทยพาณิชย์"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">เลขท้าย 4 ตัวของบัตร <span className="text-red-500">*</span></label>
                    <input type="text" value={cardLast4} onChange={(e) => { const val = e.target.value.replace(/\D/g, "").slice(0, 4); setCardLast4(val); }}
                      placeholder="xxxx" maxLength={4}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-lg tracking-widest" />
                  </div>
                </div>
              )}

              {/* === BITCOIN === */}
              {paymentMethod === "bitcoin" && (
                <div className="mb-6 space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <Bitcoin className="w-4 h-4 text-orange-400" />
                      เลือก Wallet ที่ต้องการโอน <span className="text-red-400">*</span>
                    </h3>
                    {bankAccounts.filter(b => b.accountType === "bitcoin").length > 0 ? (
                      <div className="space-y-3">
                        {bankAccounts.filter(b => b.accountType === "bitcoin").map((wallet) => (
                          <div key={wallet.id} onClick={() => setSelectedBankAccount(wallet)}
                            className={`cursor-pointer rounded-lg p-3 transition-all ${selectedBankAccount?.id === wallet.id ? "bg-orange-500/20 border-2 border-orange-500" : "bg-white/5 border border-white/10 hover:border-orange-500/50"}`}>
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedBankAccount?.id === wallet.id ? "border-orange-500 bg-orange-500" : "border-gray-500"}`}>
                                {selectedBankAccount?.id === wallet.id && <CheckCircle className="w-3 h-3 text-white" />}
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
                                <img src={wallet.qrCodeUrl} alt="QR Code" className="w-full max-w-[200px] mx-auto rounded-lg bg-white p-2" />
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
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Wallet ของคุณ <span className="text-red-500">*</span></label>
                    <input type="text" value={bitcoinWallet} onChange={(e) => setBitcoinWallet(e.target.value)} placeholder="กรอก Wallet Address ของคุณ"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm" />
                  </div>
                </div>
              )}

              {/* Buyer Info Form */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">ชื่อ-นามสกุล <span className="text-red-500">*</span></label>
                  <input type="text" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} placeholder="ชื่อ นามสกุล"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">เบอร์โทรศัพท์ <span className="text-red-500">*</span></label>
                  <input type="tel" value={buyerPhone} onChange={(e) => setBuyerPhone(e.target.value)} placeholder="0xx-xxx-xxxx"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">ที่อยู่จัดส่ง <span className="text-red-500">*</span></label>
                  <textarea value={buyerAddress} onChange={(e) => setBuyerAddress(e.target.value)} placeholder="ที่อยู่สำหรับจัดส่งสินค้า" rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent" />
                </div>
                {paymentMethod === "bank" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">เลขบัญชีผู้โอน</label>
                    <input type="text" value={buyerBankAccount} onChange={(e) => setBuyerBankAccount(e.target.value)} placeholder="เลขบัญชีที่ใช้โอนเงิน"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent" />
                  </div>
                )}

                {/* Slip Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">แนบสลิปการโอนเงิน</label>
                  {slipImage ? (
                    <div className="relative">
                      <img src={slipImage} alt="Slip" className="w-full h-48 object-contain rounded-lg bg-white/5" />
                      <button onClick={() => setSlipImage(null)} className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-rose-500/50 transition-colors">
                      <input type="file" accept="image/*" onChange={handleSlipUpload} className="hidden" disabled={uploadingSlip} />
                      {uploadingSlip ? (
                        <Loader2 className="w-8 h-8 text-rose-400 animate-spin" />
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-400">คลิกเพื่ออัพโหลดสลิป</p>
                        </>
                      )}
                    </label>
                  )}
                </div>

                {/* Purchase Policy */}
                {purchasePolicy && (
                  <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                    <input type="checkbox" id="acceptRealProductPolicy" checked={acceptedPurchasePolicy}
                      onChange={(e) => setAcceptedPurchasePolicy(e.target.checked)}
                      className="mt-1 w-4 h-4 text-green-600 rounded focus:ring-green-500 bg-white/10 border-white/20" />
                    <label htmlFor="acceptRealProductPolicy" className="text-sm text-gray-300">
                      ข้าพเจ้ายอมรับ{" "}
                      <button type="button" onClick={() => setShowPurchasePolicyModal(true)} className="text-green-400 hover:text-green-300 underline">
                        {purchasePolicy.title}
                      </button>
                    </label>
                  </div>
                )}
              </div>

              {/* Result Message */}
              {result && (
                <div className={`mb-4 p-4 rounded-lg flex items-start gap-3 ${result.success ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20"}`}>
                  {result.success ? <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />}
                  <p className={`text-sm font-medium ${result.success ? "text-green-400" : "text-red-400"}`}>{result.message}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button onClick={() => setShowPaymentModal(false)} disabled={loading}
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 text-gray-200 hover:bg-white/15 transition-colors disabled:opacity-50">
                  ยกเลิก
                </button>
                <button onClick={handleConfirmPayment}
                  disabled={loading || result?.success || (!!purchasePolicy && !acceptedPurchasePolicy)}
                  className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold hover:from-rose-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" />กำลังดำเนินการ...</>
                  ) : result?.success ? (
                    "สำเร็จ"
                  ) : (
                    <><CheckCircle className="w-4 h-4" />ยืนยันการชำระเงิน</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Purchase Policy Modal */}
      {showPurchasePolicyModal && purchasePolicy && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4" onClick={() => setShowPurchasePolicyModal(false)}>
          <div className="bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl border border-white/10" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-bold text-gray-100">{purchasePolicy.title}</h3>
              </div>
              <button onClick={() => setShowPurchasePolicyModal(false)} className="text-gray-400 hover:text-gray-200 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="prose prose-invert prose-sm max-w-none text-gray-300" dangerouslySetInnerHTML={{ __html: purchasePolicy.content }} />
            </div>
            <div className="p-6 border-t border-white/10 flex gap-3">
              <button onClick={() => setShowPurchasePolicyModal(false)} className="flex-1 px-4 py-3 bg-white/10 text-gray-200 rounded-xl font-medium hover:bg-white/15 transition-colors">
                ปิด
              </button>
              <button onClick={() => { setAcceptedPurchasePolicy(true); setShowPurchasePolicyModal(false); }}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors">
                ยอมรับนโยบาย
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
