import { Metadata } from 'next';
import GamesClient from './games-client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'เติมเกม | ระบบเติมเกมออนไลน์',
  description: 'เติมเกมออนไลน์ รวดเร็ว ปลอดภัย รองรับทุกเกมยอดนิยม',
};

async function getGames() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/games`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data.games || [];
  } catch (error) {
    console.error('Error fetching games:', error);
    return [];
  }
}

export default async function GamesPage() {
  const games = await getGames();

  return <GamesClient games={games} />;
}
