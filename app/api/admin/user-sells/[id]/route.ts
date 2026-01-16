import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// PATCH - Update sell item status (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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

    if (user?.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin only" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { status, adminNote } = body;

    if (!status || !["PENDING", "APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const sellItem = await prisma.userSellItem.update({
      where: { id },
      data: {
        status,
        adminNote: adminNote || null,
      },
    });

    return NextResponse.json({
      success: true,
      sellItem,
    });
  } catch (error) {
    console.error("Error updating sell item:", error);
    return NextResponse.json(
      { error: "Failed to update sell item" },
      { status: 500 }
    );
  }
}

// DELETE - Delete sell item (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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

    if (user?.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin only" },
        { status: 403 }
      );
    }

    const { id } = await params;

    await prisma.userSellItem.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting sell item:", error);
    return NextResponse.json(
      { error: "Failed to delete sell item" },
      { status: 500 }
    );
  }
}
