import Link from "next/link";
import Image from "next/image";
import { CreditCard, ChevronRight } from "lucide-react";

interface Card {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export default function HomeCards({ cards }: { cards: Card[] }) {
  if (cards.length === 0) {
    return null;
  }

  // Show only first 5 cards
  const displayCards = cards.slice(0, 5);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
        {displayCards.map((card) => (
          <Link
            key={card.id}
            href={`/cards/${card.id}`}
            className="group home-card rounded-xl overflow-hidden relative"
          >
            {/* Card Icon */}
            <div className="aspect-square relative flex items-center justify-center p-4 group-hover:scale-110 transition-transform duration-500">
              <div className="absolute inset-0 bg-emerald-500/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {card.icon && card.icon !== '-' ? (
                <div className="relative w-full h-full drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                  <Image
                    src={card.icon}
                    alt={card.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  />
                </div>
              ) : (
                <CreditCard className="w-12 h-12 text-emerald-400" />
              )}
            </div>

            {/* Card Info */}
            <div className="p-3 md:p-4 bg-slate-900/40 border-t border-white/5">
              <h3 className="text-sm md:text-base font-bold text-white line-clamp-2 group-hover:text-emerald-400 transition-colors text-center">
                {card.name}
              </h3>
              {card.description && (
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 text-center">
                  {card.description}
                </p>
              )}
            </div>

            {/* Hover Arrow */}
            <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <ChevronRight className="w-4 h-4 text-white" />
            </div>
          </Link>
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-8 text-center">
        <Link
          href="/cards"
          className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
        >
          <CreditCard className="w-5 h-5 mr-2" />
          ดูบัตรเติมเงินทั้งหมด
        </Link>
      </div>
    </>
  );
}
