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

// POST /api/admin/games/[gameId]/servers - สร้าง server ใหม่
export async function POST(
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
    const { name, serverCode } = body;

    // Validation
    if (!name || !serverCode) {
      return NextResponse.json(
        { error: 'กรุณากรอกชื่อ Server และ Server Code' },
        { status: 400 }
      );
    }

    // ตรวจสอบว่า game มีอยู่จริง
    const game = await prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      return NextResponse.json(
        { error: 'ไม่พบเกม' },
        { status: 404 }
      );
    }

    // สร้าง server
    const server = await prisma.server.create({
      data: {
        gameId,
        name,
        serverCode,
        isActive: true,
      },
    });

    return NextResponse.json({ server }, { status: 201 });
  } catch (error) {
    console.error('Error creating server:', error);
    return NextResponse.json(
      { error: 'Failed to create server' },
      { status: 500 }
    );
  }
}
