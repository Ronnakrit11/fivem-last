import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// POST - Create new auction bid
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "กรุณาเข้าสู่ระบบก่อนประมูล" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { gameItemId, amount } = body;

    if (!gameItemId) {
      return NextResponse.json(
        { error: "กรุณาระบุสินค้า" },
        { status: 400 }
      );
    }

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "กรุณาระบุจำนวนเงินที่ต้องการประมูล" },
        { status: 400 }
      );
    }

    // Get game item
    const gameItem = await prisma.gameItem.findUnique({
      where: { id: gameItemId },
    });

    if (!gameItem) {
      return NextResponse.json(
        { error: "ไม่พบสินค้า" },
        { status: 404 }
      );
    }

    if (!gameItem.isAuction) {
      return NextResponse.json(
        { error: "สินค้านี้ไม่ใช่สินค้าประมูล" },
        { status: 400 }
      );
    }

    if (!gameItem.isActive) {
      return NextResponse.json(
        { error: "สินค้านี้ไม่พร้อมจำหน่าย" },
        { status: 400 }
      );
    }

    // Check if auction has ended
    if (gameItem.auctionEndDate && new Date(gameItem.auctionEndDate) < new Date()) {
      return NextResponse.json(
        { error: "การประมูลสิ้นสุดแล้ว" },
        { status: 400 }
      );
    }

    // Create bid
    const bid = await prisma.auctionBid.create({
      data: {
        gameItemId,
        userId: session.user.id,
        amount: parseFloat(amount),
        status: "PENDING",
      },
      include: {
        gameItem: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      bid,
      message: "ประมูลสำเร็จ รอแอดมินอนุมัติ",
    });
  } catch (error) {
    console.error("Error creating auction bid:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการประมูล" },
      { status: 500 }
    );
  }
}

// GET - Get user's bids
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const bids = await prisma.auctionBid.findMany({
      where: { userId: session.user.id },
      include: {
        gameItem: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      bids,
    });
  } catch (error) {
    console.error("Error fetching bids:", error);
    return NextResponse.json(
      { error: "Failed to fetch bids" },
      { status: 500 }
    );
  }
}
