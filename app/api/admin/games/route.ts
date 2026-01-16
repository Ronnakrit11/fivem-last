import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// Middleware to check admin role
async function checkAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: 'Unauthorized', status: 401 };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== 'admin') {
    return { error: 'Forbidden - Admin only', status: 403 };
  }

  return { user: session.user };
}

// GET /api/admin/games - ดึงรายการเกมทั้งหมด (รวม inactive)
export async function GET() {
  try {
    const adminCheck = await checkAdmin();
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

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

    return NextResponse.json({ games }, { status: 200 });
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    );
  }
}

// POST /api/admin/games - สร้างเกมใหม่
export async function POST(request: NextRequest) {
  try {
    const adminCheck = await checkAdmin();
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const body = await request.json();
    const {
      name,
      icon,
      description,
      isPlayerId,
      playerFieldName,
      isServer,
      isActive,
    } = body;

    // Validation
    if (!name) {
      return NextResponse.json(
        { error: 'กรุณากรอกชื่อเกม' },
        { status: 400 }
      );
    }

    // หา sort สูงสุด
    const maxSort = await prisma.game.findFirst({
      orderBy: { sort: 'desc' },
      select: { sort: true },
    });

    const game = await prisma.game.create({
      data: {
        name,
        icon: icon || '-',
        description: description || '',
        isPlayerId: isPlayerId || false,
        playerFieldName: playerFieldName || 'UID',
        isServer: isServer || false,
        isActive: isActive !== undefined ? isActive : true,
        sort: (maxSort?.sort || 0) + 1,
      },
    });

    return NextResponse.json({ game }, { status: 201 });
  } catch (error) {
    console.error('Error creating game:', error);
    return NextResponse.json(
      { error: 'Failed to create game' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/games - อัปเดตการเรียงลำดับ (DnD)
export async function PATCH(request: NextRequest) {
  try {
    const adminCheck = await checkAdmin();
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const body = await request.json();
    const { games } = body; // [{ id, sort }, ...]

    if (!Array.isArray(games)) {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      );
    }

    // อัปเดตการเรียงลำดับทั้งหมด
    await Promise.all(
      games.map((game: { id: string; sort: number }) =>
        prisma.game.update({
          where: { id: game.id },
          data: { sort: game.sort },
        })
      )
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error updating game sort:', error);
    return NextResponse.json(
      { error: 'Failed to update game sort' },
      { status: 500 }
    );
  }
}
