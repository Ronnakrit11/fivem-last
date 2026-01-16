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

// PATCH /api/admin/card-options/[optionId]/toggle - Toggle isActive
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ optionId: string }> }
) {
  try {
    const adminCheck = await checkAdmin();
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const { optionId } = await params;

    const option = await prisma.cardOption.findUnique({
      where: { id: optionId },
      select: { isActive: true },
    });

    if (!option) {
      return NextResponse.json({ error: 'Card option not found' }, { status: 404 });
    }

    const updatedOption = await prisma.cardOption.update({
      where: { id: optionId },
      data: { isActive: !option.isActive },
    });

    return NextResponse.json({ 
      success: true, 
      isActive: updatedOption.isActive 
    }, { status: 200 });
  } catch (error) {
    console.error('Error toggling card option status:', error);
    return NextResponse.json(
      { error: 'Failed to toggle card option status' },
      { status: 500 }
    );
  }
}
