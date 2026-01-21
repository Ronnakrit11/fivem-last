import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET - Get all game item orders (admin only)
export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Pagination params - parse early
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Start all queries in parallel including admin check
    const [user, total, orders] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
      }),
      prisma.gameItemOrder.count(),
      prisma.gameItemOrder.findMany({
        select: {
          id: true,
          gameItemId: true,
          userId: true,
          amount: true,
          status: true,
          buyerName: true,
          buyerPhone: true,
          buyerBankAccount: true,
          selectedPaymentMethod: true,
          slipImage: true,
          acceptedPurchasePolicy: true,
          createdAt: true,
          gameItem: {
            select: {
              id: true,
              name: true,
              image: true,
              price: true,
              isCustomPrice: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    // Check admin role after parallel fetch
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin only" },
        { status: 403 }
      );
    }

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching game item orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
