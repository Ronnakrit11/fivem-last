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

// POST /api/admin/packages - สร้าง package ใหม่
export async function POST(request: NextRequest) {
  try {
    const adminCheck = await checkAdmin();
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const body = await request.json();
    const {
      gameId,
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
    if (!gameId || !name) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }

    // หา sort สูงสุดใน game นี้
    const maxSort = await prisma.package.findFirst({
      where: { gameId },
      orderBy: { sort: 'desc' },
      select: { sort: true },
    });

    const packageData = await prisma.package.create({
      data: {
        gameId,
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

    return NextResponse.json({ package: packageData }, { status: 201 });
  } catch (error) {
    console.error('Error creating package:', error);
    return NextResponse.json(
      { error: 'Failed to create package' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/packages - อัปเดตการเรียงลำดับ (DnD)
export async function PATCH(request: NextRequest) {
  try {
    const adminCheck = await checkAdmin();
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const body = await request.json();
    const { packages } = body; // [{ id, sort }, ...]

    if (!Array.isArray(packages)) {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      );
    }

    // อัปเดตการเรียงลำดับทั้งหมด
    await Promise.all(
      packages.map((pkg: { id: string; sort: number }) =>
        prisma.package.update({
          where: { id: pkg.id },
          data: { sort: pkg.sort },
        })
      )
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error updating package sort:', error);
    return NextResponse.json(
      { error: 'Failed to update package sort' },
      { status: 500 }
    );
  }
}
