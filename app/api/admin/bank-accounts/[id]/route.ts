import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { bankName, accountNumber, accountName, isActive, sortOrder, qrCodeUrl } = body;

    const bankAccount = await prisma.bankAccount.update({
      where: { id },
      data: {
        ...(bankName && { bankName }),
        ...(accountNumber && { accountNumber }),
        ...(accountName && { accountName }),
        ...(isActive !== undefined && { isActive }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...(qrCodeUrl !== undefined && { qrCodeUrl: qrCodeUrl || null }),
      },
    });

    return NextResponse.json({ success: true, data: bankAccount });
  } catch (error) {
    console.error("Error updating bank account:", error);
    return NextResponse.json(
      { error: "Failed to update bank account" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    await prisma.bankAccount.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting bank account:", error);
    return NextResponse.json(
      { error: "Failed to delete bank account" },
      { status: 500 }
    );
  }
}
