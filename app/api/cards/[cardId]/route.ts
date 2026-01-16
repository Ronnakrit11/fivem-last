import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/cards/[cardId] - ดึงข้อมูลบัตรเติมเงินเดียวพร้อม options
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ cardId: string }> }
) {
  try {
    const { cardId } = await params;

    const card = await prisma.card.findUnique({
      where: {
        id: cardId,
        isActive: true,
      },
      include: {
        cardOptions: {
          where: {
            isActive: true,
          },
          orderBy: {
            sort: 'asc',
          },
        },
      },
    });

    if (!card) {
      return NextResponse.json(
        { error: 'Card not found' },
        { status: 404 }
      );
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
