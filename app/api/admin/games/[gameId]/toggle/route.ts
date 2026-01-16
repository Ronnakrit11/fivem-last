import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

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

// PATCH /api/admin/games/[gameId]/toggle - Toggle isActive
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const adminCheck = await checkAdmin();
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const { gameId } = await params;

    // ดึงค่าปัจจุบัน
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      select: { isActive: true },
    });

    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    // Toggle isActive
    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: { isActive: !game.isActive },
    });

    return NextResponse.json({ 
      success: true, 
      isActive: updatedGame.isActive 
    }, { status: 200 });
  } catch (error) {
    console.error('Error toggling game status:', error);
    return NextResponse.json(
      { error: 'Failed to toggle game status' },
      { status: 500 }
    );
  }
}
