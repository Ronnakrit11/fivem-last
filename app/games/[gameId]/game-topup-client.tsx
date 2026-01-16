"use client";

import { useState } from "react";
import {
    Gamepad2,
    User,
    Server,
    Package,
    CheckCircle2,
    X,
    ShoppingCart,
    Loader2,
    Sparkles,
    ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useBalance } from "@/app/contexts/BalanceContext";

interface GameData {
    id: string;
    name: string;
    icon: string;
    description: string;
    isPlayerId: boolean;
    playerFieldName: string;
    isServer: boolean;
    packages: PackageData[];
    mixPackages: MixPackageData[];
}

interface PackageData {
    id: string;
    name: string;
    price: number;
    priceVip: number;
    priceAgent: number;
    icon: string;
    sort: number;
}

interface MixPackageData {
    id: string;
    name: string;
    price: number;
    priceVip: number;
    priceAgent: number;
    icon: string;
    items: string[];
    sort: number;
}

interface ServerData {
    id: string;
    name: string;
    serverCode: string;
}

export default function GameTopupClient({
    game,
    servers,
}: {
    game: GameData;
    servers: ServerData[];
}) {
    const router = useRouter();
    const { updateBalance } = useBalance();
    const [playerId, setPlayerId] = useState("");
    const [selectedServerId, setSelectedServerId] = useState("");
    const [activeTab, setActiveTab] = useState<"package" | "mixPackage">(
        "package"
    );
    const [selectedPackageId, setSelectedPackageId] = useState("");
    const [selectedMixPackageId, setSelectedMixPackageId] = useState("");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Get selected item
    const selectedPackage = game.packages.find(
        (p) => p.id === selectedPackageId
    );
    const selectedMixPackage = game.mixPackages.find(
        (p) => p.id === selectedMixPackageId
    );
    const selectedPrice =
        activeTab === "package"
            ? Number(selectedPackage?.price || 0)
            : Number(selectedMixPackage?.price || 0);

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/games/topup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    gameId: game.id,
                    playerId: game.isPlayerId ? playerId : undefined,
                    serverId: game.isServer ? selectedServerId : undefined,
                    packageId:
                        activeTab === "package" ? selectedPackageId : undefined,
                    mixPackageId:
                        activeTab === "mixPackage"
                            ? selectedMixPackageId
                            : undefined,
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
            router.push("/history/games");
        } catch (error) {
            console.error("Error:", error);
            alert("เกิดข้อผิดพลาดในการทำรายการ");
        } finally {
            setIsSubmitting(false);
        }
    };

    const canSubmit = () => {
        if (game.isPlayerId && !playerId) return false;
        if (game.isServer && !selectedServerId) return false;
        if (activeTab === "package" && !selectedPackageId) return false;
        if (activeTab === "mixPackage" && !selectedMixPackageId) return false;
        return true;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Grid Layout: 1/4 and 3/4 */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Left Card - Game Info (1/4) */}
                    <div className="lg:col-span-1">
                        <div className="rounded-2xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 ring-1 ring-white/5 shadow-xl sticky top-6">
                            {/* Game Icon */}
                            <div className="aspect-square relative bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-8">
                                {game.icon && game.icon !== "-" ? (
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={game.icon}
                                            alt={game.name}
                                            fill
                                            className="object-contain"
                                            sizes="300px"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Gamepad2 className="w-24 h-24 text-indigo-300" />
                                    </div>
                                )}
                            </div>

                            {/* Game Details */}
                            <div className="p-6">
                                <h1 className="text-2xl font-bold text-white mb-3">
                                    {game.name}
                                </h1>
                                {game.description && (
                                    <p className="text-sm text-gray-300 leading-relaxed">
                                        {game.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Card - Topup Form (3/4) */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Player Info Card */}
                        <div className="rounded-2xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 ring-1 ring-white/5 shadow-xl p-6">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                                <User className="w-6 h-6 mr-2 text-indigo-400" />
                                ข้อมูลผู้เล่น
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Player ID Input */}
                                {game.isPlayerId && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            {game.playerFieldName}
                                            <span className="text-red-400 ml-1">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            value={playerId}
                                            onChange={(e) =>
                                                setPlayerId(e.target.value)
                                            }
                                            placeholder={`กรอก ${game.playerFieldName}`}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                )}

                                {/* Server Select */}
                                {game.isServer && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            <Server className="w-4 h-4 inline mr-1" />
                                            เซิร์ฟเวอร์
                                            <span className="text-red-400 ml-1">
                                                *
                                            </span>
                                        </label>
                                        <select
                                            value={selectedServerId}
                                            onChange={(e) =>
                                                setSelectedServerId(
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                                        >
                                            <option
                                                value=""
                                                className="bg-slate-900"
                                            >
                                                เลือกเซิร์ฟเวอร์
                                            </option>
                                            {servers.map((server) => (
                                                <option
                                                    key={server.id}
                                                    value={server.id}
                                                    className="bg-slate-900"
                                                >
                                                    {server.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Package Selection Card */}
                        <div className="rounded-2xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 ring-1 ring-white/5 shadow-xl">
                            <div className="p-6 border-b border-white/10">
                                <h2 className="text-xl font-semibold text-white flex items-center">
                                    <Package className="w-6 h-6 mr-2 text-indigo-400" />
                                    เลือกแพ็คเกจ
                                </h2>
                            </div>

                            {/* Tabs */}
                            <div className="flex border-b border-white/10">
                                <button
                                    onClick={() => {
                                        setActiveTab("package");
                                        setSelectedMixPackageId("");
                                    }}
                                    className={`flex-1 px-6 py-4 font-semibold transition-all ${
                                        activeTab === "package"
                                            ? "text-white bg-indigo-600/30 border-b-2 border-indigo-500"
                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                    }`}
                                >
                                    แพ็คเกจปกติ
                                </button>
                                <button
                                    onClick={() => {
                                        setActiveTab("mixPackage");
                                        setSelectedPackageId("");
                                    }}
                                    className={`flex-1 px-6 py-4 font-semibold transition-all ${
                                        activeTab === "mixPackage"
                                            ? "text-white bg-indigo-600/30 border-b-2 border-indigo-500"
                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                    }`}
                                >
                                    แพ็คเกจผสม
                                </button>
                            </div>

                            {/* Package Grid */}
                            <div className="p-6">
                                {activeTab === "package" ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {game.packages.length > 0 ? (
                                            game.packages.map((pkg) => (
                                                <button
                                                    key={pkg.id}
                                                    onClick={() =>
                                                        setSelectedPackageId(
                                                            pkg.id
                                                        )
                                                    }
                                                    className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
                                                        selectedPackageId ===
                                                        pkg.id
                                                            ? "ring-2 ring-indigo-500 bg-indigo-600/30 scale-105"
                                                            : "bg-white/5 hover:bg-white/10 hover:scale-102"
                                                    }`}
                                                >
                                                    {/* Icon */}
                                                    <div className="aspect-square bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center p-4">
                                                        {pkg.icon &&
                                                        pkg.icon !== "" ? (
                                                            <div className="relative w-full h-full">
                                                                <Image
                                                                    src={
                                                                        pkg.icon
                                                                    }
                                                                    alt={
                                                                        pkg.name
                                                                    }
                                                                    fill
                                                                    className="object-contain"
                                                                    sizes="150px"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <Package className="w-12 h-12 text-indigo-300" />
                                                        )}
                                                    </div>

                                                    {/* Info */}
                                                    <div className="p-3 text-center">
                                                        <p className="text-sm font-semibold text-white mb-1 line-clamp-2">
                                                            {pkg.name}
                                                        </p>
                                                        <p className="text-lg font-bold text-indigo-300">
                                                            ฿
                                                            {Number(
                                                                pkg.price
                                                            ).toFixed(2)}
                                                        </p>
                                                    </div>

                                                    {/* Selected Indicator */}
                                                    {selectedPackageId ===
                                                        pkg.id && (
                                                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                                                            <CheckCircle2 className="w-4 h-4 text-white" />
                                                        </div>
                                                    )}
                                                </button>
                                            ))
                                        ) : (
                                            <div className="col-span-full text-center py-12 text-gray-400">
                                                ไม่มีแพ็คเกจให้เลือก
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {game.mixPackages.length > 0 ? (
                                            game.mixPackages.map((pkg) => (
                                                <button
                                                    key={pkg.id}
                                                    onClick={() =>
                                                        setSelectedMixPackageId(
                                                            pkg.id
                                                        )
                                                    }
                                                    className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
                                                        selectedMixPackageId ===
                                                        pkg.id
                                                            ? "ring-2 ring-purple-500 bg-purple-600/30 scale-105"
                                                            : "bg-white/5 hover:bg-white/10 hover:scale-102"
                                                    }`}
                                                >
                                                    {/* Icon */}
                                                    <div className="aspect-square bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center p-4">
                                                        {pkg.icon &&
                                                        pkg.icon !== "" ? (
                                                            <div className="relative w-full h-full">
                                                                <Image
                                                                    src={
                                                                        pkg.icon
                                                                    }
                                                                    alt={
                                                                        pkg.name
                                                                    }
                                                                    fill
                                                                    className="object-contain"
                                                                    sizes="150px"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <Package className="w-12 h-12 text-purple-300" />
                                                        )}
                                                    </div>

                                                    {/* Info */}
                                                    <div className="p-3 text-center">
                                                        <p className="text-sm font-semibold text-white mb-1 line-clamp-2">
                                                            {pkg.name}
                                                        </p>
                                                        <p className="text-lg font-bold text-purple-300">
                                                            ฿
                                                            {Number(
                                                                pkg.price
                                                            ).toFixed(2)}
                                                        </p>
                                                    </div>

                                                    {/* Selected Indicator */}
                                                    {selectedMixPackageId ===
                                                        pkg.id && (
                                                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                                                            <CheckCircle2 className="w-4 h-4 text-white" />
                                                        </div>
                                                    )}
                                                </button>
                                            ))
                                        ) : (
                                            <div className="col-span-full text-center py-12 text-gray-400">
                                                ไม่มีแพ็คเกจผสมให้เลือก
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Order Summary Card */}
                        <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl border border-indigo-400/30 ring-1 ring-white/5 shadow-xl p-6">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                                <ShoppingCart className="w-6 h-6 mr-2 text-indigo-400" />
                                สรุปคำสั่งซื้อ
                            </h2>

                            <div className="space-y-3">
                                <div className="flex justify-between text-gray-300">
                                    <span>เกม:</span>
                                    <span className="font-semibold text-white">
                                        {game.name}
                                    </span>
                                </div>

                                {game.isPlayerId && playerId && (
                                    <div className="flex justify-between text-gray-300">
                                        <span>{game.playerFieldName}:</span>
                                        <span className="font-mono text-indigo-300">
                                            {playerId}
                                        </span>
                                    </div>
                                )}

                                {game.isServer && selectedServerId && (
                                    <div className="flex justify-between text-gray-300">
                                        <span>เซิร์ฟเวอร์:</span>
                                        <span className="font-semibold text-white">
                                            {
                                                servers.find(
                                                    (s) =>
                                                        s.id ===
                                                        selectedServerId
                                                )?.name
                                            }
                                        </span>
                                    </div>
                                )}

                                {(selectedPackage || selectedMixPackage) && (
                                    <div className="flex justify-between text-gray-300">
                                        <span>แพ็คเกจ:</span>
                                        <span className="font-semibold text-white">
                                            {selectedPackage?.name ||
                                                selectedMixPackage?.name}
                                        </span>
                                    </div>
                                )}

                                <div className="border-t border-white/20 pt-3 mt-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-semibold text-white">
                                            ยอดรวม:
                                        </span>
                                        <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
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
                                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:scale-102"
                                        : "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                                }`}
                            >
                                เติมเกม
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirm Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 pb-24 animate-in fade-in duration-200">
                    <div className="bg-gradient-to-br from-slate-900/95 via-slate-900/95 to-indigo-900/50 backdrop-blur-xl rounded-3xl shadow-2xl max-w-lg w-full border border-indigo-400/30 animate-in zoom-in duration-300 overflow-hidden max-h-[90vh] overflow-y-auto">
                        {/* Header with gradient */}
                        <div className="relative bg-gradient-to-r from-indigo-600/20 to-purple-600/20 px-6 py-5 border-b border-white/10">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 animate-pulse" />
                            <div className="relative flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                                        <Sparkles className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white">
                                            ยืนยันการเติมเกม
                                        </h3>
                                        <p className="text-xs text-gray-300">
                                            กรุณาตรวจสอบรายละเอียดก่อนยืนยัน
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowConfirmModal(false)}
                                    className="text-gray-400 hover:text-white transition-colors hover:rotate-90 duration-300"
                                    disabled={isSubmitting}
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4">
                            {/* Game Card */}
                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-400/30 p-4 group hover:scale-[1.02] transition-all duration-300">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all" />
                                <div className="relative flex items-center gap-4">
                                    {/* Game Icon */}
                                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm flex items-center justify-center p-2 border border-white/20 shadow-xl">
                                        {game.icon && game.icon !== "-" ? (
                                            <div className="relative w-full h-full">
                                                <Image
                                                    src={game.icon}
                                                    alt={game.name}
                                                    fill
                                                    className="object-contain"
                                                    sizes="64px"
                                                />
                                            </div>
                                        ) : (
                                            <Gamepad2 className="w-8 h-8 text-indigo-300" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Gamepad2 className="w-4 h-4 text-indigo-400" />
                                            <p className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                                                เกม
                                            </p>
                                        </div>
                                        <p className="text-xl font-bold text-white">
                                            {game.name}
                                        </p>
                                        {game.description && (
                                            <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                                                {game.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Player Info */}
                            {game.isPlayerId && playerId && (
                                <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 hover:bg-white/10 transition-all">
                                    <div className="flex items-center gap-2 mb-2">
                                        <User className="w-4 h-4 text-purple-400" />
                                        <p className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
                                            {game.playerFieldName}
                                        </p>
                                    </div>
                                    <p className="text-lg font-mono text-white bg-black/20 px-3 py-2 rounded-lg border border-purple-400/20">
                                        {playerId}
                                    </p>
                                </div>
                            )}

                            {/* Server Info */}
                            {game.isServer &&
                                selectedServerId &&
                                servers.find(
                                    (s) => s.id === selectedServerId
                                ) && (
                                    <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 hover:bg-white/10 transition-all">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Server className="w-4 h-4 text-cyan-400" />
                                            <p className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                                                เซิร์ฟเวอร์
                                            </p>
                                        </div>
                                        <p className="text-lg font-semibold text-white">
                                            {
                                                servers.find(
                                                    (s) =>
                                                        s.id ===
                                                        selectedServerId
                                                )?.name
                                            }
                                        </p>
                                    </div>
                                )}

                            {/* Package Card */}
                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 border border-purple-400/30 p-4 group hover:scale-[1.02] transition-all duration-300">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all" />
                                <div className="relative flex items-center gap-4">
                                    {/* Package Icon */}
                                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm flex items-center justify-center p-2 border border-white/20 shadow-xl">
                                        {(selectedPackage?.icon ||
                                            selectedMixPackage?.icon) &&
                                        (selectedPackage?.icon !== "" ||
                                            selectedMixPackage?.icon !== "") ? (
                                            <div className="relative w-full h-full">
                                                <Image
                                                    src={
                                                        (selectedPackage?.icon ||
                                                            selectedMixPackage?.icon) as string
                                                    }
                                                    alt={
                                                        selectedPackage?.name ||
                                                        selectedMixPackage?.name ||
                                                        "Package"
                                                    }
                                                    fill
                                                    className="object-contain"
                                                    sizes="64px"
                                                />
                                            </div>
                                        ) : (
                                            <ShoppingBag className="w-8 h-8 text-purple-300" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Package className="w-4 h-4 text-purple-400" />
                                            <p className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
                                                แพ็คเกจ
                                            </p>
                                        </div>
                                        <p className="text-xl font-bold text-white">
                                            {selectedPackage?.name ||
                                                selectedMixPackage?.name}
                                        </p>
                                        {activeTab === "mixPackage" && (
                                            <div className="flex items-center gap-1 mt-1">
                                                <Sparkles className="w-3 h-3 text-amber-400" />
                                                <p className="text-xs text-amber-300 font-semibold">
                                                    Mix Package
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Price Summary */}
                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-red-500/20 border-2 border-amber-400/50 p-6 shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 animate-pulse" />
                                <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl" />
                                <div className="relative">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-amber-500/30 flex items-center justify-center">
                                                <ShoppingCart className="w-5 h-5 text-amber-300" />
                                            </div>
                                            <p className="text-sm font-semibold text-amber-200 uppercase tracking-wider">
                                                ยอดชำระทั้งหมด
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-5xl font-bold bg-gradient-to-r from-amber-200 via-amber-300 to-orange-300 bg-clip-text text-transparent drop-shadow-lg">
                                                ฿{selectedPrice.toFixed(2)}
                                            </p>
                                            <p className="text-xs text-amber-300/80 mt-2">
                                                ราคารวมทั้งหมด
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <div className="flex items-center gap-1 bg-green-500/20 px-3 py-1 rounded-full border border-green-400/30">
                                                <CheckCircle2 className="w-3 h-3 text-green-400" />
                                                <span className="text-xs font-semibold text-green-300">
                                                    พร้อมชำระ
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="px-6 pb-6 flex gap-3">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                disabled={isSubmitting}
                                className="flex-1 px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 hover:scale-105 transition-all shadow-xl shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        กำลังดำเนินการ...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-5 h-5" />
                                        ยืนยันการเติมเกม
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
