"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Order {
  id: string;
  productName: string;
  productImage: string;
  date: string;
  status: string;
}

// OrderCard Component
function OrderCard({
  productName,
  productImage,
  date,
  status,
}: {
  productName: string;
  productImage: string;
  date: string;
  status: string;
}) {
  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("th-TH", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  };

  return (
    <div className="flex-shrink-0 w-64 md:w-80 rounded-lg p-3 md:p-4 bg-slate-800/40 border border-white/10 shadow-sm backdrop-blur-md">
      <div className="flex items-start gap-2 md:gap-3">
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white/5 border border-white/10">
          {productImage ? (
            <Image
              src={productImage}
              alt={productName}
              width={64}
              height={64}
              className="w-full h-full object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-white/5 flex items-center justify-center">
              <span className="text-slate-500 text-xs">No img</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs md:text-sm font-bold text-white truncate mb-1">
            {productName}
          </h4>
          <p className="text-xs text-slate-400 mb-2">
            {formatDate(date)}
          </p>
          <div className="flex gap-1 md:gap-2 flex-wrap">
            <span className="inline-flex items-center px-2 py-0.5 md:py-1 rounded-full text-xs font-semibold bg-pink-500/10 text-pink-400 border border-pink-500/20">
              {status}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 md:py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              มีสินค้า
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RecentOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/recent-orders")
      .then(res => res.json())
      .then(data => {
        setOrders(data.orders || []);
      })
      .catch(err => {
        console.error("Error fetching orders:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // NOW safe to do conditional returns
  if (loading) {
    return (
      <div className="mt-20">
        <div className="rounded-2xl p-6 glass-panel shadow-lg">
          <h3 className="text-xl font-bold text-white mb-2">
            การสั่งซื้อล่าสุด
          </h3>
          <p className="text-sm text-slate-400 mb-6">
            ประวัติการสั่งซื้อสินค้าในเว็บ (2 วันล่าสุด)
          </p>
          <div className="animate-pulse">
            <div className="h-24 bg-white/5 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="mt-20">
        <div className="rounded-2xl p-6 glass-panel shadow-lg">
          <h3 className="text-xl font-bold text-white mb-2">
            การสั่งซื้อล่าสุด
          </h3>
          <p className="text-sm text-slate-400 mb-6">
            ประวัติการสั่งซื้อสินค้าในเว็บ (2 วันล่าสุด)
          </p>
          <p className="text-center text-slate-500 py-8">
            ยังไม่มีคำสั่งซื้อในช่วง 2 วันที่ผ่านมา
          </p>
        </div>
      </div>
    );
  }

  // Only duplicate if we have enough orders for smooth scroll, otherwise just show once
  const displayOrders = orders.length >= 5 
    ? [...orders, ...orders] 
    : orders;

  return (
    <div className="mt-20">
      <div className="rounded-2xl p-6 glass-panel shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full -z-10" />
        <h3 className="text-xl font-bold text-white mb-2">
          การสั่งซื้อล่าสุด
        </h3>
        <p className="text-sm text-slate-400 mb-6">
          ประวัติการสั่งซื้อสินค้าในเว็บ (2 วันล่าสุด)
        </p>

        {/* Infinite Scrolling Orders */}
        <div className="relative overflow-hidden">
          <div
            className="flex gap-3 md:gap-4 will-change-transform"
            style={orders.length >= 5 ? {
              animation: "infiniteScroll 40s linear infinite",
            } : undefined}
          >
            {displayOrders.map((order, index) => (
              <OrderCard
                key={`${order.id}-${index}`}
                productName={order.productName}
                productImage={order.productImage}
                date={order.date}
                status={order.status}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes infiniteScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-25%);
          }
        }
        
        /* Faster on mobile */
        @media (max-width: 768px) {
          [style*="infiniteScroll"] {
            animation-duration: 25s !important;
          }
        }
        
        /* Enable hardware acceleration */
        .will-change-transform {
          will-change: transform;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
}
