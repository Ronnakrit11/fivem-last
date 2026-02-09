import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { sendTelegramNotification } from "@/lib/telegram";

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { productId, productName, price } = body;

    if (!productId || !price) {
      return NextResponse.json(
        { error: "Product ID and price are required" },
        { status: 400 }
      );
    }

    // Get user balance
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { balance: true, email: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if user has enough balance
    if (user.balance < price) {
      return NextResponse.json(
        { 
          error: "ยอดเงินของคุณไม่เพียงพอ",
          message: "ยอดเงินของคุณไม่เพียงพอ",
          balance: user.balance,
          required: price,
        },
        { status: 400 }
      );
    }

    // Generate reference ID
    const reference = `ORDER-${Date.now()}-${session.user.id.slice(0, 8)}`;

    // Call purchase API
    const apiKey = process.env.PEAMSUB_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API Key not configured" },
        { status: 500 }
      );
    }

    const encodedKey = Buffer.from(apiKey).toString("base64");

    const purchaseResponse = await fetch(
      "https://api.peamsub24hr.com/v2/app-premium",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${encodedKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: productId,
          reference: reference,
        }),
      }
    );

    const purchaseData = await purchaseResponse.json();

    if (!purchaseResponse.ok || purchaseData.statusCode !== 200) {
      return NextResponse.json(
        { 
          error: "Purchase failed",
          message: purchaseData.message || "เกิดข้อผิดพลาดในการซื้อสินค้า",
        },
        { status: purchaseResponse.status }
      );
    }

    // Deduct balance
    const newBalance = user.balance - price;
    await prisma.user.update({
      where: { id: session.user.id },
      data: { balance: newBalance },
    });

    // Save purchase history
    await prisma.purchaseHistory.create({
      data: {
        userId: session.user.id,
        productId: productId.toString(),
        productName: productName,
        price: price,
        prize: purchaseData.data, // ข้อมูลสินค้าที่ได้รับ
        reference: reference,
        status: "success",
      },
    });

    // Send Telegram notification
    sendTelegramNotification(
      `🎮 <b>การซื้อสินค้าผ่านระบบ!</b>\n\n` +
      `📦 สินค้า: ${productName || productId}\n` +
      `💰 ราคา: ฿${price.toFixed(2)}\n` +
      `👤 ผู้ซื้อ: ${user.email || "-"}\n` +
      `🔖 Ref: ${reference}\n` +
      `🕐 เวลา: ${new Date().toLocaleString("th-TH", { timeZone: "Asia/Bangkok" })}`
    ).catch(() => {});

    // Return success
    return NextResponse.json({
      success: true,
      message: "ซื้อสินค้าสำเร็จ!",
      data: {
        product: purchaseData.data,
        reference: reference,
        price: price,
        newBalance: newBalance,
      },
    });

  } catch (error) {
    console.error("Error processing purchase:", error);
    return NextResponse.json(
      { error: "Failed to process purchase" },
      { status: 500 }
    );
  }
}
