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

// PATCH /api/admin/cards/[cardId]/toggle - Toggle isActive
export async function PATCH(
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
      select: { isActive: true },
    });

    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    const updatedCard = await prisma.card.update({
      where: { id: cardId },
      data: { isActive: !card.isActive },
    });

    return NextResponse.json({ 
      success: true, 
      isActive: updatedCard.isActive 
    }, { status: 200 });
  } catch (error) {
    console.error('Error toggling card status:', error);
    return NextResponse.json(
      { error: 'Failed to toggle card status' },
      { status: 500 }
    );
  }
}
