"use client";

import { CreditCard, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Card {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export default function CardsClient({ cards }: { cards: Card[] }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500/80 to-emerald-600/80 backdrop-blur-xl border border-white/30 ring-1 ring-black/5 shadow-lg mb-4">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            บัตรเติมเงิน
          </h1>
          <p className="text-lg text-gray-300">ซื้อบัตรเติมเงินออนไลน์ รวดเร็ว ปลอดภัย</p>
        </div>

        {/* Cards Grid */}
        {cards.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {cards.map((card) => (
              <Link
                key={card.id}
                href={`/cards/${card.id}`}
                className="group"
              >
                <div className="relative rounded-2xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 ring-1 ring-white/5 shadow-xl transition-all duration-300 hover:scale-105 hover:bg-white/15 hover:border-green-400/50 hover:shadow-2xl hover:shadow-green-500/20">
                  {/* Icon */}
                  <div className="aspect-square relative bg-gradient-to-br from-green-500/10 to-emerald-500/10 flex items-center justify-center p-6">
                    {card.icon && card.icon !== '-' ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={card.icon}
                          alt={card.name}
                          fill
                          className="object-contain"
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                        />
                      </div>
                    ) : (
                      <CreditCard className="w-16 h-16 text-green-300" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 bg-gradient-to-b from-transparent to-black/20">
                    <h3 className="text-white font-semibold text-center mb-1 line-clamp-2 group-hover:text-green-300 transition-colors">
                      {card.name}
                    </h3>
                    {card.description && (
                      <p className="text-xs text-gray-400 text-center line-clamp-2">
                        {card.description}
                      </p>
                    )}
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-green-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  
                  {/* Arrow Icon */}
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                    <ChevronRight className="w-5 h-5 text-white" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 mb-6">
              <CreditCard className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">
              ยังไม่มีบัตรเติมเงินให้บริการ
            </h3>
            <p className="text-gray-400">กรุณารอระบบเพิ่มบัตรเติมเงินในเร็วๆ นี้</p>
          </div>
        )}

        {/* Info Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-green-400/30 p-6">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-white font-semibold mb-2">ได้บัตรทันที</h3>
            <p className="text-sm text-gray-300">รับบัตรเติมเงินทันทีหลังชำระเงิน</p>
          </div>

          <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-blue-400/30 p-6">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-white font-semibold mb-2">ปลอดภัย 100%</h3>
            <p className="text-sm text-gray-300">รับประกันความปลอดภัย ไม่มีปัญหาบัตรไม่ขึ้น</p>
          </div>

          <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-400/30 p-6">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="text-white font-semibold mb-2">ราคาประหยัด</h3>
            <p className="text-sm text-gray-300">ราคาถูกกว่า ซื้อง่าย ไม่ต้องออกจากบ้าน</p>
          </div>
        </div>
      </div>
    </div>
  );
}
