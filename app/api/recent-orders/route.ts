import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get orders from last 2 days
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const recentOrders = await prisma.gameItemOrder.findMany({
      where: {
        createdAt: {
          gte: twoDaysAgo,
        },
      },
      include: {
        gameItem: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });

    // Map status to display text
    const getStatusText = (status: string) => {
      switch (status) {
        case "APPROVED":
        case "COMPLETED":
          return "ส่งสินค้าแล้ว";
        case "PENDING":
          return "รอดำเนินการ";
        case "REJECTED":
          return "ยกเลิก";
        default:
          return status;
      }
    };

    return NextResponse.json({
      orders: recentOrders.map(order => ({
        id: order.id,
        productName: order.gameItem?.name || "สินค้า",
        productImage: order.gameItem?.image || "",
        date: order.createdAt.toISOString(),
        status: getStatusText(order.status),
      })),
    });
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent orders", orders: [] },
      { status: 500 }
    );
  }
}
