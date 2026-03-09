import { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ServersManagementClient from './servers-management-client';

export const metadata: Metadata = {
  title: 'จัดการ Servers | Admin',
};

async function getGameWithServers(gameId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      redirect('/');
    }

    // ตรวจสอบว่าเป็น admin หรือไม่
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== 'admin' && user?.role !== 'owner') {
      redirect('/');
    }

    // เรียก database โดยตรงแทนการเรียก API
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: {
        servers: {
          orderBy: { name: 'asc' },
        },
      },
    });

    if (!game) {
      redirect('/admin/games-management');
    }

    return game;
  } catch (error) {
    const err = error as { digest?: string };
    if (err?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    console.error('Error fetching game:', error);
    redirect('/admin/games-management');
  }
}

export default async function ServersManagementPage({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const { gameId } = await params;
  const game = await getGameWithServers(gameId);

  return <ServersManagementClient initialGame={game} />;
}
