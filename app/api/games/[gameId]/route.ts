import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/games/[gameId] - ดึงข้อมูลเกมเดียวพร้อม packages และ servers
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const { gameId } = await params;

    const game = await prisma.game.findUnique({
      where: {
        id: gameId,
        isActive: true,
      },
      include: {
        packages: {
          where: {
            isActive: true,
          },
          orderBy: {
            sort: 'asc',
          },
        },
        mixPackages: {
          where: {
            isActive: true,
          },
          orderBy: {
            sort: 'asc',
          },
        },
      },
    });

    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    // ดึง servers ของเกมนี้ถ้าเกมต้องการ
    let servers: Array<{ id: string; name: string; serverCode: string }> = [];
    if (game.isServer) {
      servers = await prisma.server.findMany({
        where: {
          gameId: gameId,
          isActive: true,
        },
        select: {
          id: true,
          name: true,
          serverCode: true,
        },
        orderBy: {
          name: 'asc',
        },
      });
    }

    return NextResponse.json({ game, servers }, { status: 200 });
  } catch (error) {
    console.error('Error fetching game:', error);
    return NextResponse.json(
      { error: 'Failed to fetch game' },
      { status: 500 }
    );
  }
}
