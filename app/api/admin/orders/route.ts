import { NextRequest, NextResponse } from "next/server";
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

    // Check admin or owner role after parallel fetch
    if (!user || ((user.role !== "admin" && user.role !== "owner"))) {
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

// DELETE - Delete order (owner only)
export async function DELETE(request: NextRequest) {
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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    // Only owner can delete
    if (!user || user.role !== "owner") {
      return NextResponse.json(
        { error: "Forbidden - Owner only" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("id");

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    await prisma.purchaseHistory.delete({
      where: { id: orderId },
    });

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 500 }
    );
  }
}
