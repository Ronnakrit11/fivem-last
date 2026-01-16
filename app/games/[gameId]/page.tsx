import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import GameTopupClient from './game-topup-client';

export const metadata: Metadata = {
  title: 'เติมเกม',
};

async function getGameData(gameId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/games/${gameId}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching game data:', error);
    return null;
  }
}

export default async function GameTopupPage({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const { gameId } = await params;
  const data = await getGameData(gameId);

  if (!data || !data.game) {
    notFound();
  }

  return <GameTopupClient game={data.game} servers={data.servers || []} />;
}
