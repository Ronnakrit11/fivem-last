import Link from "next/link";
import Image from "next/image";
import { Gamepad2, ChevronRight } from "lucide-react";

interface Game {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export default function HomeGames({ games }: { games: Game[] }) {
  if (games.length === 0) {
    return null;
  }

  // Show only first 10 games
  const displayGames = games.slice(0, 10);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
        {displayGames.map((game) => (
          <Link
            key={game.id}
            href={`/games/${game.id}`}
            className="group home-card rounded-xl overflow-hidden relative"
          >
            {/* Game Icon */}
            <div className="aspect-square relative flex items-center justify-center p-4 group-hover:scale-110 transition-transform duration-500">
              <div className="absolute inset-0 bg-indigo-500/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {game.icon && game.icon !== '-' ? (
                <div className="relative w-full h-full drop-shadow-[0_0_15px_rgba(129,140,248,0.3)]">
                  <Image
                    src={game.icon}
                    alt={game.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  />
                </div>
              ) : (
                <Gamepad2 className="w-12 h-12 text-indigo-400" />
              )}
            </div>

            {/* Game Info */}
            <div className="p-3 md:p-4 bg-slate-900/40 border-t border-white/5">
              <h3 className="text-sm md:text-base font-bold text-white line-clamp-2 group-hover:text-indigo-400 transition-colors text-center">
                {game.name}
              </h3>
              {game.description && (
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 text-center">
                  {game.description}
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
          href="/games"
          className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
        >
          <Gamepad2 className="w-5 h-5 mr-2" />
          ดูเกมทั้งหมด
        </Link>
      </div>
    </>
  );
}
