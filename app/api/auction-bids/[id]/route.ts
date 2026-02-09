import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// PATCH - User uploads slip image for their winning bid
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bid = await prisma.auctionBid.findUnique({
      where: { id },
      select: { userId: true, status: true },
    });

    if (!bid) {
      return NextResponse.json({ error: "ไม่พบรายการประมูล" }, { status: 404 });
    }

    if (bid.userId !== session.user.id) {
      return NextResponse.json({ error: "ไม่มีสิทธิ์แก้ไขรายการนี้" }, { status: 403 });
    }

    if (bid.status !== "WON") {
      return NextResponse.json({ error: "สถานะไม่ถูกต้อง" }, { status: 400 });
    }

    const body = await request.json();
    const { slipImage } = body;

    if (!slipImage) {
      return NextResponse.json({ error: "กรุณาแนบสลิปการโอนเงิน" }, { status: 400 });
    }

    const updated = await prisma.auctionBid.update({
      where: { id },
      data: {
        slipImage,
        status: "PAID",
      },
    });

    return NextResponse.json({
      success: true,
      bid: updated,
      message: "อัปโหลดสลิปสำเร็จ รอแอดมินตรวจสอบ",
    });
  } catch (error) {
    console.error("Error updating auction bid:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
