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

// PATCH /api/admin/packages/[packageId]/toggle - Toggle isActive
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ packageId: string }> }
) {
  try {
    const adminCheck = await checkAdmin();
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const { packageId } = await params;

    const pkg = await prisma.package.findUnique({
      where: { id: packageId },
      select: { isActive: true },
    });

    if (!pkg) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    const updatedPackage = await prisma.package.update({
      where: { id: packageId },
      data: { isActive: !pkg.isActive },
    });

    return NextResponse.json({ 
      success: true, 
      isActive: updatedPackage.isActive 
    }, { status: 200 });
  } catch (error) {
    console.error('Error toggling package status:', error);
    return NextResponse.json(
      { error: 'Failed to toggle package status' },
      { status: 500 }
    );
  }
}
