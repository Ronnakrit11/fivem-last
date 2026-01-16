import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/games/featured - ดึงรายการเกมยอดนิยม (featured)
export async function GET() {
  try {
    const games = await prisma.game.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      orderBy: {
        sort: 'asc',
      },
      select: {
        id: true,
        name: true,
        icon: true,
        description: true,
        isPlayerId: true,
        playerFieldName: true,
        isServer: true,
      },
    });

    return NextResponse.json({ games }, { status: 200 });
  } catch (error) {
    console.error('Error fetching featured games:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured games' },
      { status: 500 }
    );
  }
}
