"use client";

import { useState } from "react";
import {
    CreditCard,
    Package,
    CheckCircle2,
    X,
    ShoppingCart,
    Loader2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useBalance } from "@/app/contexts/BalanceContext";

interface CardData {
    id: string;
    name: string;
    icon: string;
    description: string;
    cardOptions: CardOptionData[];
}

interface CardOptionData {
    id: string;
    name: string;
    price: number;
    priceVip: number;
    priceAgent: number;
    icon: string;
    sort: number;
}

export default function CardPurchaseClient({ card }: { card: CardData }) {
    const router = useRouter();
    const { updateBalance } = useBalance();
    const [selectedOptionId, setSelectedOptionId] = useState("");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const selectedOption = card.cardOptions.find(
        (opt) => opt.id === selectedOptionId
    );
    const selectedPrice = Number(selectedOption?.price || 0);

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/cards/purchase", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    cardId: card.id,
                    cardOptionId: selectedOptionId,
                    amount: 1,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error || "เกิดข้อผิดพลาด");
                setIsSubmitting(false);
                return;
            }

            // Update balance immediately
            if (data.newBalance !== undefined) {
                updateBalance(data.newBalance);
            }

            alert(data.message);
            setShowConfirmModal(false);
            router.push("/history/cards");
        } catch (error) {
            console.error("Error:", error);
            alert("เกิดข้อผิดพลาดในการทำรายการ");
        } finally {
            setIsSubmitting(false);
        }
    };

    const canSubmit = () => {
        return !!selectedOptionId;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Grid Layout: 1/4 and 3/4 */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Left Card - Card Info (1/4) */}
                    <div className="lg:col-span-1">
                        <div className="rounded-2xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 ring-1 ring-white/5 shadow-xl sticky top-6">
                            {/* Card Icon */}
                            <div className="aspect-square relative bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-8">
                                {card.icon && card.icon !== "-" ? (
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={card.icon}
                                            alt={card.name}
                                            fill
                                            className="object-contain"
                                            sizes="300px"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <CreditCard className="w-24 h-24 text-green-300" />
                                    </div>
                                )}
                            </div>

                            {/* Card Details */}
                            <div className="p-6">
                                <h1 className="text-2xl font-bold text-white mb-3">
                                    {card.name}
                                </h1>
                                {card.description && (
                                    <p className="text-sm text-gray-300 leading-relaxed">
                                        {card.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Card - Purchase Form (3/4) */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Card Options Selection */}
                        <div className="rounded-2xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 ring-1 ring-white/5 shadow-xl">
                            <div className="p-6 border-b border-white/10">
                                <h2 className="text-xl font-semibold text-white flex items-center">
                                    <Package className="w-6 h-6 mr-2 text-green-400" />
                                    เลือกบัตรเติมเงิน
                                </h2>
                            </div>

                            {/* Options Grid */}
                            <div className="p-6">
                                {card.cardOptions.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {card.cardOptions.map((option) => (
                                            <button
                                                key={option.id}
                                                onClick={() =>
                                                    setSelectedOptionId(
                                                        option.id
                                                    )
                                                }
                                                className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
                                                    selectedOptionId ===
                                                    option.id
                                                        ? "ring-2 ring-green-500 bg-green-600/30 scale-105"
                                                        : "bg-white/5 hover:bg-white/10 hover:scale-102"
                                                }`}
                                            >
                                                {/* Icon */}
                                                <div className="aspect-square bg-gradient-to-br from-green-500/10 to-emerald-500/10 flex items-center justify-center p-4">
                                                    {option.icon &&
                                                    option.icon !== "" ? (
                                                        <div className="relative w-full h-full">
                                                            <Image
                                                                src={
                                                                    option.icon
                                                                }
                                                                alt={
                                                                    option.name
                                                                }
                                                                fill
                                                                className="object-contain"
                                                                sizes="150px"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <CreditCard className="w-12 h-12 text-green-300" />
                                                    )}
                                                </div>

                                                {/* Info */}
                                                <div className="p-3 text-center">
                                                    <p className="text-sm font-semibold text-white mb-1 line-clamp-2">
                                                        {option.name}
                                                    </p>
                                                    <p className="text-lg font-bold text-green-300">
                                                        ฿
                                                        {Number(
                                                            option.price
                                                        ).toFixed(2)}
                                                    </p>
                                                </div>

                                                {/* Selected Indicator */}
                                                {selectedOptionId ===
                                                    option.id && (
                                                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-gray-400">
                                        ไม่มีบัตรเติมเงินให้เลือก
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Order Summary Card */}
                        <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-green-400/30 ring-1 ring-white/5 shadow-xl p-6">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                                <ShoppingCart className="w-6 h-6 mr-2 text-green-400" />
                                สรุปคำสั่งซื้อ
                            </h2>

                            <div className="space-y-3">
                                <div className="flex justify-between text-gray-300">
                                    <span>บัตรเติมเงิน:</span>
                                    <span className="font-semibold text-white">
                                        {card.name}
                                    </span>
                                </div>

                                {selectedOption && (
                                    <div className="flex justify-between text-gray-300">
                                        <span>ประเภท:</span>
                                        <span className="font-semibold text-white">
                                            {selectedOption.name}
                                        </span>
                                    </div>
                                )}

                                <div className="border-t border-white/20 pt-3 mt-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-semibold text-white">
                                            ยอดรวม:
                                        </span>
                                        <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                                            ฿{selectedPrice.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowConfirmModal(true)}
                                disabled={!canSubmit()}
                                className={`mt-6 w-full px-6 py-4 rounded-xl font-semibold transition-all shadow-lg ${
                                    canSubmit()
                                        ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 hover:scale-102"
                                        : "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                                }`}
                            >
                                ซื้อบัตรเติมเงิน
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirm Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 pb-24 animate-in fade-in duration-200">
                    <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full p-6 border border-white/20 animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-white">
                                ยืนยันการซื้อบัตรเติมเงิน
                            </h3>
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                                disabled={isSubmitting}
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <p className="text-sm text-gray-400 mb-1">
                                    บัตรเติมเงิน
                                </p>
                                <p className="text-lg font-semibold text-white">
                                    {card.name}
                                </p>
                            </div>

                            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <p className="text-sm text-gray-400 mb-1">
                                    ประเภท
                                </p>
                                <p className="text-lg font-semibold text-white">
                                    {selectedOption?.name}
                                </p>
                            </div>

                            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-4 border border-green-400/30">
                                <p className="text-sm text-gray-400 mb-1">
                                    ยอดชำระ
                                </p>
                                <p className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                                    ฿{selectedPrice.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                disabled={isSubmitting}
                                className="flex-1 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        กำลังดำเนินการ...
                                    </>
                                ) : (
                                    "ยืนยัน"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
