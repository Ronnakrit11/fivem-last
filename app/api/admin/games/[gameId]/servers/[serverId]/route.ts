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

// PUT /api/admin/games/[gameId]/servers/[serverId] - แก้ไข server
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string; serverId: string }> }
) {
  try {
    const adminCheck = await checkAdmin();
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const { gameId, serverId } = await params;
    const body = await request.json();
    const { name, serverCode, isActive } = body;

    // Validation
    if (!name || !serverCode) {
      return NextResponse.json(
        { error: 'กรุณากรอกชื่อ Server และ Server Code' },
        { status: 400 }
      );
    }

    // ตรวจสอบว่า server เป็นของ game นี้
    const existingServer = await prisma.server.findFirst({
      where: {
        id: serverId,
        gameId: gameId,
      },
    });

    if (!existingServer) {
      return NextResponse.json(
        { error: 'ไม่พบ Server หรือ Server ไม่ได้อยู่ในเกมนี้' },
        { status: 404 }
      );
    }

    const server = await prisma.server.update({
      where: { id: serverId },
      data: {
        name,
        serverCode,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({ server }, { status: 200 });
  } catch (error) {
    console.error('Error updating server:', error);
    return NextResponse.json(
      { error: 'Failed to update server' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/games/[gameId]/servers/[serverId] - ลบ server
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string; serverId: string }> }
) {
  try {
    const adminCheck = await checkAdmin();
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const { gameId, serverId } = await params;

    // ตรวจสอบว่า server เป็นของ game นี้
    const existingServer = await prisma.server.findFirst({
      where: {
        id: serverId,
        gameId: gameId,
      },
    });

    if (!existingServer) {
      return NextResponse.json(
        { error: 'ไม่พบ Server หรือ Server ไม่ได้อยู่ในเกมนี้' },
        { status: 404 }
      );
    }

    await prisma.server.delete({
      where: { id: serverId },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting server:', error);
    return NextResponse.json(
      { error: 'Failed to delete server' },
      { status: 500 }
    );
  }
}
