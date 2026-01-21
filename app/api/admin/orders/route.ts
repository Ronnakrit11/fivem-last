import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch admin check and orders in parallel
    const [user, orders] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
      }),
      prisma.purchaseHistory.findMany({
        select: {
          id: true,
          userId: true,
          productId: true,
          productName: true,
          price: true,
          reference: true,
          status: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 100, // Limit to recent 100 orders
      }),
    ]);

    // Check admin role after parallel fetch
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin only" },
        { status: 403 }
      );
    }

    // Get unique user IDs
    const userIds = [...new Set(orders.map(o => o.userId))];

    // Fetch user info
    const users = await prisma.user.findMany({
      where: {
        id: { in: userIds },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    // Create user map for quick lookup
    const userMap = new Map(users.map(u => [u.id, u]));

    return NextResponse.json({
      orders: orders.map(order => {
        const user = userMap.get(order.userId);
        return {
          id: order.id,
          userId: order.userId,
          userName: user?.name || "Unknown",
          userEmail: user?.email || "-",
          productId: order.productId,
          productName: order.productName,
          price: Number(order.price),
          reference: order.reference,
          status: order.status,
          createdAt: order.createdAt,
        };
      }),
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
