import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { Decimal } from '@prisma/client/runtime/library';

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

  if ((user?.role !== 'admin' && user?.role !== 'owner')) {
    return { error: 'Forbidden - Admin only', status: 403 };
  }

  return { user: session.user };
}

// PUT /api/admin/card-options/[optionId]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ optionId: string }> }
) {
  try {
    const adminCheck = await checkAdmin();
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const { optionId } = await params;
    const body = await request.json();
    const {
      name,
      price,
      priceVip,
      priceAgent,
      cost,
      gameCode,
      packageCode,
      icon,
      isActive,
    } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'กรุณากรอกชื่อ option' },
        { status: 400 }
      );
    }

    const cardOption = await prisma.cardOption.update({
      where: { id: optionId },
      data: {
        name,
        price: new Decimal(price || 0),
        priceVip: new Decimal(priceVip || 0),
        priceAgent: new Decimal(priceAgent || 0),
        cost: new Decimal(cost || 0),
        gameCode: gameCode || null,
        packageCode: packageCode || null,
        icon: icon || '',
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({ cardOption }, { status: 200 });
  } catch (error) {
    console.error('Error updating card option:', error);
    return NextResponse.json(
      { error: 'Failed to update card option' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/card-options/[optionId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ optionId: string }> }
) {
  try {
    const adminCheck = await checkAdmin();
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const { optionId } = await params;

    await prisma.cardOption.delete({
      where: { id: optionId },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting card option:', error);
    return NextResponse.json(
      { error: 'Failed to delete card option' },
      { status: 500 }
    );
  }
}
