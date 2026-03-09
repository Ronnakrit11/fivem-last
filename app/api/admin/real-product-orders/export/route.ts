import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user || (user.role !== "admin" && user.role !== "owner")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const orders = await prisma.realProductOrder.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: {
          include: { realProduct: { select: { name: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const statusMap: Record<string, string> = {
      PENDING: "รอดำเนินการ",
      APPROVED: "อนุมัติแล้ว",
      REJECTED: "ปฏิเสธ",
      COMPLETED: "เสร็จสิ้น",
    };

    // Build CSV with BOM for Excel UTF-8 compatibility
    const headers = [
      "หมายเลขคำสั่งซื้อ",
      "วันที่สั่งซื้อ",
      "ชื่อผู้สั่ง",
      "เบอร์โทร",
      "ที่อยู่จัดส่ง",
      "เลขบัญชีผู้โอน",
      "วิธีชำระเงิน",
      "รายการสินค้า",
      "ยอดรวม",
      "สถานะ",
      "บัญชีผู้ใช้",
      "อีเมล",
    ];

    const rows = orders.map((order) => {
      const itemsList = order.items
        .map((item) => `${item.realProduct.name} x${item.quantity} (฿${item.price.toFixed(2)})`)
        .join(" | ");

      const createdAt = new Date(order.createdAt).toLocaleString("th-TH", {
        timeZone: "Asia/Bangkok",
      });

      return [
        order.id,
        createdAt,
        order.buyerName || "-",
        order.buyerPhone || "-",
        order.buyerAddress || "-",
        order.buyerBankAccount || "-",
        order.selectedPaymentMethod || "-",
        itemsList,
        order.totalAmount.toFixed(2),
        statusMap[order.status] || order.status,
        order.user?.name || "-",
        order.user?.email || "-",
      ];
    });

    const escapeCsv = (val: string) => {
      if (val.includes(",") || val.includes('"') || val.includes("\n")) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    };

    const csvContent =
      "\uFEFF" +
      headers.map(escapeCsv).join(",") +
      "\n" +
      rows.map((row) => row.map(escapeCsv).join(",")).join("\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="real-product-orders-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    console.error("Error exporting real product orders:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
