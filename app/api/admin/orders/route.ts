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

    // Check if user is admin
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

    // Fetch all purchase history
    const orders = await prisma.purchaseHistory.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

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
