import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// PATCH - Update contact button (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user || (user.role !== "admin" && user.role !== "owner")) {
      return NextResponse.json(
        { error: "Forbidden - Admin only" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, link, icon, qrCodeUrl, isActive, sortOrder } = body;

    const button = await prisma.contactButton.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(link !== undefined && { link }),
        ...(icon !== undefined && { icon }),
        ...(qrCodeUrl !== undefined && { qrCodeUrl }),
        ...(isActive !== undefined && { isActive }),
        ...(sortOrder !== undefined && { sortOrder }),
      },
    });

    return NextResponse.json({
      success: true,
      button,
      message: "อัปเดตปุ่มติดต่อสำเร็จ",
    });
  } catch (error) {
    console.error("Error updating contact button:", error);
    return NextResponse.json(
      { error: "Failed to update contact button" },
      { status: 500 }
    );
  }
}

// DELETE - Delete contact button (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user || (user.role !== "admin" && user.role !== "owner")) {
      return NextResponse.json(
        { error: "Forbidden - Admin only" },
        { status: 403 }
      );
    }

    await prisma.contactButton.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "ลบปุ่มติดต่อสำเร็จ",
    });
  } catch (error) {
    console.error("Error deleting contact button:", error);
    return NextResponse.json(
      { error: "Failed to delete contact button" },
      { status: 500 }
    );
  }
}
