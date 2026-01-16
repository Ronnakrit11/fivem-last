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

// GET /api/admin/cards/[cardId]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ cardId: string }> }
) {
  try {
    const adminCheck = await checkAdmin();
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const { cardId } = await params;

    const card = await prisma.card.findUnique({
      where: { id: cardId },
      include: {
        cardOptions: {
          orderBy: { sort: 'asc' },
        },
      },
    });

    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    return NextResponse.json({ card }, { status: 200 });
  } catch (error) {
    console.error('Error fetching card:', error);
    return NextResponse.json(
      { error: 'Failed to fetch card' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/cards/[cardId]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ cardId: string }> }
) {
  try {
    const adminCheck = await checkAdmin();
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const { cardId } = await params;
    const body = await request.json();
    const { name, icon, description, isActive } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'กรุณากรอกชื่อบัตร' },
        { status: 400 }
      );
    }

    const card = await prisma.card.update({
      where: { id: cardId },
      data: {
        name,
        icon: icon || '-',
        description: description || '',
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({ card }, { status: 200 });
  } catch (error) {
    console.error('Error updating card:', error);
    return NextResponse.json(
      { error: 'Failed to update card' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/cards/[cardId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ cardId: string }> }
) {
  try {
    const adminCheck = await checkAdmin();
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const { cardId } = await params;

    await prisma.card.delete({
      where: { id: cardId },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting card:', error);
    return NextResponse.json(
      { error: 'Failed to delete card' },
      { status: 500 }
    );
  }
}
