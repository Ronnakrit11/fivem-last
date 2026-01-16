import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET /api/history/cards - ดึงประวัติการซื้อบัตรเติมเงิน
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const purchases = await prisma.purchaseCard.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        cardOption: {
          include: {
            card: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ purchases }, { status: 200 });
  } catch (error) {
    console.error('Error fetching card history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}
