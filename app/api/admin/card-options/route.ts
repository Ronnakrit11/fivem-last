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

// POST /api/admin/card-options
export async function POST(request: NextRequest) {
  try {
    const adminCheck = await checkAdmin();
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const body = await request.json();
    const {
      cardId,
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

    if (!cardId || !name) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }

    const maxSort = await prisma.cardOption.findFirst({
      where: { cardId },
      orderBy: { sort: 'desc' },
      select: { sort: true },
    });

    const cardOption = await prisma.cardOption.create({
      data: {
        cardId,
        name,
        price: new Decimal(price || 0),
        priceVip: new Decimal(priceVip || 0),
        priceAgent: new Decimal(priceAgent || 0),
        cost: new Decimal(cost || 0),
        gameCode: gameCode || null,
        packageCode: packageCode || null,
        icon: icon || '',
        isActive: isActive !== undefined ? isActive : true,
        sort: (maxSort?.sort || 0) + 1,
      },
    });

    return NextResponse.json({ cardOption }, { status: 201 });
  } catch (error) {
    console.error('Error creating card option:', error);
    return NextResponse.json(
      { error: 'Failed to create card option' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/card-options
export async function PATCH(request: NextRequest) {
  try {
    const adminCheck = await checkAdmin();
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const body = await request.json();
    const { cardOptions } = body;

    if (!Array.isArray(cardOptions)) {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      );
    }

    await Promise.all(
      cardOptions.map((option: { id: string; sort: number }) =>
        prisma.cardOption.update({
          where: { id: option.id },
          data: { sort: option.sort },
        })
      )
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error updating card option sort:', error);
    return NextResponse.json(
      { error: 'Failed to update card option sort' },
      { status: 500 }
    );
  }
}
