import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/games - ดึงรายการเกมทั้งหมด
export async function GET(request: NextRequest) {
  try {
    const games = await prisma.game.findMany({
      where: {
        isActive: true,
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
    console.error('Error fetching games:', error);
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    );
  }
}
