import { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import GamesManagementClient from './games-management-client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'จัดการเกม | Admin',
};

async function checkAdminAndGetGames() {
  try {
    // Check if user is logged in
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      redirect('/');
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== 'admin' && user?.role !== 'owner') {
      redirect('/');
    }

    // Fetch games directly from database
    const games = await prisma.game.findMany({
      orderBy: { sort: 'asc' },
      include: {
        packages: {
          orderBy: { sort: 'asc' },
        },
        mixPackages: {
          orderBy: { sort: 'asc' },
        },
      },
    });

    return games;
  } catch (error) {
    // Rethrow redirect errors to allow proper navigation
    if (error && typeof error === 'object' && 'digest' in error && 
        typeof error.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    console.error('Error fetching games:', error);
    return [];
  }
}

export default async function GamesManagementPage() {
  const games = await checkAdminAndGetGames();

  return <GamesManagementClient initialGames={games} />;
}
