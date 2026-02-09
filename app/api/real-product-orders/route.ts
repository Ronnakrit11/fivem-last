import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { sendTelegramNotification } from "@/lib/telegram";

// POST - Create new real product order (from cart)
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "กรุณาเข้าสู่ระบบก่อนสั่งซื้อ" }, { status: 401 });
    }

    const body = await request.json();
    const {
      items,
      buyerName,
      buyerPhone,
      buyerAddress,
      buyerBankAccount,
      selectedPaymentMethod,
      slipImage,
      acceptedPurchasePolicy,
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "กรุณาเลือกสินค้า" }, { status: 400 });
    }

    // Validate all products exist and have stock
    const productIds = items.map((item: { productId: string }) => item.productId);
    const products = await prisma.realProduct.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json({ error: "สินค้าบางรายการไม่พร้อมจำหน่าย" }, { status: 400 });
    }

    // Check stock
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) continue;
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `สินค้า "${product.name}" มีสต๊อคไม่เพียงพอ (เหลือ ${product.stock})` },
          { status: 400 }
        );
      }
    }

    // Calculate total
    let totalAmount = 0;
    const orderItems = items.map((item: { productId: string; quantity: number }) => {
      const product = products.find((p) => p.id === item.productId)!;
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;
      return {
        realProductId: item.productId,
        quantity: item.quantity,
        price: product.price,
      };
    });

    // Create order and reduce stock in transaction
    const order = await prisma.$transaction(async (tx) => {
      // Reduce stock for each item
      for (const item of items) {
        await tx.realProduct.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Create order with items
      return tx.realProductOrder.create({
        data: {
          userId: session.user.id,
          totalAmount,
          buyerName: buyerName || "",
          buyerPhone: buyerPhone || "",
          buyerAddress: buyerAddress || "",
          buyerBankAccount: buyerBankAccount || "",
          selectedPaymentMethod: selectedPaymentMethod || "",
          slipImage: slipImage || null,
          acceptedPurchasePolicy: acceptedPurchasePolicy || false,
          status: "PENDING",
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: { realProduct: true },
          },
        },
      });
    });

    // Send Telegram notification
    const itemsList = order.items
      .map((item) => `  - ${item.realProduct.name} x${item.quantity} (฿${(item.price * item.quantity).toFixed(2)})`)
      .join("\n");

    sendTelegramNotification(
      `🛍️ <b>คำสั่งซื้อสินค้าจริงใหม่!</b>\n\n` +
        `📦 รายการสินค้า:\n${itemsList}\n` +
        `💰 ยอดรวม: ฿${totalAmount.toFixed(2)}\n` +
        `👤 ผู้สั่ง: ${buyerName || session.user.name || "-"}\n` +
        `📱 เบอร์: ${buyerPhone || "-"}\n` +
        `📍 ที่อยู่: ${buyerAddress || "-"}\n` +
        `🕐 เวลา: ${new Date().toLocaleString("th-TH", { timeZone: "Asia/Bangkok" })}`
    ).catch(() => {});

    return NextResponse.json({
      success: true,
      order,
      message: "สั่งซื้อสำเร็จ รอแอดมินอนุมัติ",
    });
  } catch (error) {
    console.error("Error creating real product order:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการสั่งซื้อ" }, { status: 500 });
  }
}

// GET - Get user's real product orders
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.realProductOrder.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: { realProduct: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching real product orders:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
