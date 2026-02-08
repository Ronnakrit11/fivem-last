import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// PATCH - Update download link (user only, own items)
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

    const { id } = await params;
    const body = await request.json();
    const { downloadLink } = body;

    // Verify the item belongs to the user
    const existingItem = await prisma.userSellItem.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: "ไม่พบรายการ" },
        { status: 404 }
      );
    }

    if (existingItem.userId !== session.user.id) {
      return NextResponse.json(
        { error: "ไม่มีสิทธิ์แก้ไขรายการนี้" },
        { status: 403 }
      );
    }

    const sellItem = await prisma.userSellItem.update({
      where: { id },
      data: {
        downloadLink: downloadLink || null,
      },
    });

    return NextResponse.json({
      success: true,
      sellItem,
    });
  } catch (error) {
    console.error("Error updating sell item:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
