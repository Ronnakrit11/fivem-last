"use client";

import { Gamepad2, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Game {
  id: string;
  name: string;
  icon: string;
  description: string;
  isPlayerId: boolean;
  playerFieldName: string;
  isServer: boolean;
}

export default function GamesClient({ games }: { games: Game[] }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/80 to-purple-600/80 backdrop-blur-xl border border-white/30 ring-1 ring-black/5 shadow-lg mb-4">
            <Gamepad2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            เติมเกมออนไลน์
          </h1>
          <p className="text-lg text-gray-300">เลือกเกมที่ต้องการเติม รวดเร็ว ปลอดภัย</p>
        </div>

        {/* Games Grid */}
        {games.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {games.map((game) => (
              <Link
                key={game.id}
                href={`/games/${game.id}`}
                className="group"
              >
                <div className="relative rounded-2xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 ring-1 ring-white/5 shadow-xl transition-all duration-300 hover:scale-105 hover:bg-white/15 hover:border-indigo-400/50 hover:shadow-2xl hover:shadow-indigo-500/20">
                  {/* Icon */}
                  <div className="aspect-square relative bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center p-6">
                    {game.icon && game.icon !== '-' ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={game.icon}
                          alt={game.name}
                          fill
                          className="object-contain"
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                        />
                      </div>
                    ) : (
                      <Gamepad2 className="w-16 h-16 text-indigo-300" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 bg-gradient-to-b from-transparent to-black/20">
                    <h3 className="text-white font-semibold text-center mb-1 line-clamp-2 group-hover:text-indigo-300 transition-colors">
                      {game.name}
                    </h3>
                    {game.description && (
                      <p className="text-xs text-gray-400 text-center line-clamp-2">
                        {game.description}
                      </p>
                    )}
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  
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
              <Gamepad2 className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">
              ยังไม่มีเกมให้บริการ
            </h3>
            <p className="text-gray-400">กรุณารอระบบเพิ่มเกมในเร็วๆ นี้</p>
          </div>
        )}

        {/* Info Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-blue-400/30 p-6">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-white font-semibold mb-2">รวดเร็วทันใจ</h3>
            <p className="text-sm text-gray-300">ระบบประมวลผลอัตโนมัติ รับของภายใน 1-5 นาที</p>
          </div>

          <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-green-400/30 p-6">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-white font-semibold mb-2">ปลอดภัย 100%</h3>
            <p className="text-sm text-gray-300">ระบบรักษาความปลอดภัยระดับสูง</p>
          </div>

          <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-400/30 p-6">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
              <span className="text-2xl">💎</span>
            </div>
            <h3 className="text-white font-semibold mb-2">ราคาถูกที่สุด</h3>
            <p className="text-sm text-gray-300">ราคาพิเศษ ถูกกว่าที่อื่นแน่นอน</p>
          </div>
        </div>
      </div>
    </div>
  );
}
