import { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PackagesManagementClient from './packages-management-client';

export const metadata: Metadata = {
  title: 'จัดการ Packages | Admin',
};

async function getGameWithPackages(gameId: string) {
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
        packages: {
          orderBy: { sort: 'asc' },
        },
        mixPackages: {
          orderBy: { sort: 'asc' },
        },
      },
    });

    if (!game) {
      redirect('/admin/games-management');
    }

    // แปลง Decimal เป็น number สำหรับ client component
    return {
      ...game,
      packages: game.packages.map((pkg) => ({
        ...pkg,
        price: Number(pkg.price),
        priceVip: Number(pkg.priceVip),
        priceAgent: Number(pkg.priceAgent),
        cost: Number(pkg.cost),
      })),
      mixPackages: game.mixPackages.map((mix) => ({
        ...mix,
        price: Number(mix.price),
        priceVip: Number(mix.priceVip),
        priceAgent: Number(mix.priceAgent),
        cost: Number(mix.cost),
      })),
    };
  } catch (error) {
    // Check for Next.js redirect error
    const err = error as { digest?: string };
    if (err?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    console.error('Error fetching game:', error);
    redirect('/admin/games-management');
  }
}

export default async function PackagesManagementPage({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const { gameId } = await params;
  const game = await getGameWithPackages(gameId);

  return <PackagesManagementClient initialGame={game} />;
}
