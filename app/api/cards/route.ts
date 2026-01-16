import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/cards - ดึงรายการบัตรเติมเงินทั้งหมด
export async function GET(request: NextRequest) {
  try {
    const cards = await prisma.card.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        sort: 'asc',
      },
      select: {
        id: true,
        name: true,
        icon: true,
        description: true,
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
