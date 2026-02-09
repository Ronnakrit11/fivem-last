import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { sendTelegramNotification } from "@/lib/telegram";

// POST - Create new game item order
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "กรุณาเข้าสู่ระบบก่อนสั่งซื้อ" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { gameItemId, amount, buyerName, buyerPhone, buyerBankAccount, slipImage, acceptedPurchasePolicy, selectedPaymentMethod } = body;

    if (!gameItemId) {
      return NextResponse.json(
        { error: "กรุณาระบุสินค้า" },
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

    if (!gameItem.isActive) {
      return NextResponse.json(
        { error: "สินค้านี้ไม่พร้อมจำหน่าย" },
        { status: 400 }
      );
    }

    // Check stock if not unlimited
    if (!gameItem.isUnlimitedStock && gameItem.stock <= 0) {
      return NextResponse.json(
        { error: "สินค้าหมด" },
        { status: 400 }
      );
    }

    // Determine amount
    let orderAmount = gameItem.price;
    if (gameItem.isCustomPrice) {
      if (!amount || amount <= 0) {
        return NextResponse.json(
          { error: "กรุณาระบุจำนวนเงิน" },
          { status: 400 }
        );
      }
      orderAmount = parseFloat(amount);
    }

    // Create order and reduce stock if not unlimited
    const order = await prisma.$transaction(async (tx) => {
      // Reduce stock if not unlimited
      if (!gameItem.isUnlimitedStock) {
        await tx.gameItem.update({
          where: { id: gameItemId },
          data: { stock: { decrement: 1 } },
        });
      }

      // Create order
      return tx.gameItemOrder.create({
        data: {
          gameItemId,
          userId: session.user.id,
          amount: orderAmount,
          buyerName: buyerName || "",
          buyerPhone: buyerPhone || "",
          buyerBankAccount: buyerBankAccount || "",
          selectedPaymentMethod: selectedPaymentMethod || "",
          slipImage: slipImage || null,
          acceptedPurchasePolicy: acceptedPurchasePolicy || false,
          status: "PENDING",
        },
        include: {
          gameItem: true,
        },
      });
    });

    // Send Telegram notification
    sendTelegramNotification(
      `🛒 <b>คำสั่งซื้อไอเทมเกมใหม่!</b>\n\n` +
      `📦 สินค้า: ${order.gameItem.name}\n` +
      `💰 จำนวนเงิน: ฿${orderAmount.toFixed(2)}\n` +
      `👤 ผู้สั่ง: ${buyerName || session.user.name || "-"}\n` +
      `📱 เบอร์: ${buyerPhone || "-"}\n` +
      `🕐 เวลา: ${new Date().toLocaleString("th-TH", { timeZone: "Asia/Bangkok" })}`
    ).catch(() => {});

    return NextResponse.json({
      success: true,
      order,
      message: "สั่งซื้อสำเร็จ รอแอดมินอนุมัติ",
    });
  } catch (error) {
    console.error("Error creating game item order:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการสั่งซื้อ" },
      { status: 500 }
    );
  }
}

// GET - Get user's orders
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

    const orders = await prisma.gameItemOrder.findMany({
      where: { userId: session.user.id },
      include: {
        gameItem: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
