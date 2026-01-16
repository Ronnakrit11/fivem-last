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

// GET /api/admin/games/[gameId] - ดึงข้อมูลเกมเดียว
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const adminCheck = await checkAdmin();
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const { gameId } = await params;

    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: {
        packages: {
          orderBy: { sort: 'asc' },
        },
        mixPackages: {
          orderBy: { sort: 'asc' },
        },
        servers: {
          orderBy: { name: 'asc' },
        },
      },
    });

    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ game }, { status: 200 });
  } catch (error) {
    console.error('Error fetching game:', error);
    return NextResponse.json(
      { error: 'Failed to fetch game' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/games/[gameId] - แก้ไขเกม
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const adminCheck = await checkAdmin();
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const { gameId } = await params;
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

    const game = await prisma.game.update({
      where: { id: gameId },
      data: {
        name,
        icon: icon || '-',
        description: description || '',
        isPlayerId: isPlayerId || false,
        playerFieldName: playerFieldName || 'UID',
        isServer: isServer || false,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({ game }, { status: 200 });
  } catch (error) {
    console.error('Error updating game:', error);
    return NextResponse.json(
      { error: 'Failed to update game' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/games/[gameId] - ลบเกม
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const adminCheck = await checkAdmin();
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const { gameId } = await params;

    // ลบเกม (จะลบ packages และ mixPackages ด้วยเพราะมี onDelete: Cascade)
    await prisma.game.delete({
      where: { id: gameId },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting game:', error);
    return NextResponse.json(
      { error: 'Failed to delete game' },
      { status: 500 }
    );
  }
}
