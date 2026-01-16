import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { Decimal } from '@prisma/client/runtime/library';

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

// PUT /api/admin/packages/[packageId] - แก้ไข package
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ packageId: string }> }
) {
  try {
    const adminCheck = await checkAdmin();
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const { packageId } = await params;
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

    // Validation
    if (!name) {
      return NextResponse.json(
        { error: 'กรุณากรอกชื่อแพ็คเกจ' },
        { status: 400 }
      );
    }

    const packageData = await prisma.package.update({
      where: { id: packageId },
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

    return NextResponse.json({ package: packageData }, { status: 200 });
  } catch (error) {
    console.error('Error updating package:', error);
    return NextResponse.json(
      { error: 'Failed to update package' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/packages/[packageId] - ลบ package
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ packageId: string }> }
) {
  try {
    const adminCheck = await checkAdmin();
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const { packageId } = await params;

    await prisma.package.delete({
      where: { id: packageId },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting package:', error);
    return NextResponse.json(
      { error: 'Failed to delete package' },
      { status: 500 }
    );
  }
}
