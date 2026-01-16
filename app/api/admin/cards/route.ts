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

// GET /api/admin/cards - ดึงรายการบัตรทั้งหมด
export async function GET() {
  try {
    const adminCheck = await checkAdmin();
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const cards = await prisma.card.findMany({
      orderBy: { sort: 'asc' },
      include: {
        cardOptions: {
          orderBy: { sort: 'asc' },
        },
      },
    });

    return NextResponse.json({ cards }, { status: 200 });
  } catch (error) {
    console.error('Error fetching cards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cards' },
      { status: 500 }
    );
  }
}

// POST /api/admin/cards - สร้างบัตรใหม่
export async function POST(request: NextRequest) {
  try {
    const adminCheck = await checkAdmin();
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const body = await request.json();
    const { name, icon, description, isActive } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'กรุณากรอกชื่อบัตร' },
        { status: 400 }
      );
    }

    const maxSort = await prisma.card.findFirst({
      orderBy: { sort: 'desc' },
      select: { sort: true },
    });

    const card = await prisma.card.create({
      data: {
        name,
        icon: icon || '-',
        description: description || '',
        isActive: isActive !== undefined ? isActive : true,
        sort: (maxSort?.sort || 0) + 1,
      },
    });

    return NextResponse.json({ card }, { status: 201 });
  } catch (error) {
    console.error('Error creating card:', error);
    return NextResponse.json(
      { error: 'Failed to create card' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/cards - อัปเดตการเรียงลำดับ (DnD)
export async function PATCH(request: NextRequest) {
  try {
    const adminCheck = await checkAdmin();
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const body = await request.json();
    const { cards } = body;

    if (!Array.isArray(cards)) {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      );
    }

    await Promise.all(
      cards.map((card: { id: string; sort: number }) =>
        prisma.card.update({
          where: { id: card.id },
          data: { sort: card.sort },
        })
      )
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error updating card sort:', error);
    return NextResponse.json(
      { error: 'Failed to update card sort' },
      { status: 500 }
    );
  }
}
