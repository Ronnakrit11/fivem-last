import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET - Get all user sell items (admin only)
export async function GET(request: NextRequest) {
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

    // Pagination params - parse early
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Start all queries in parallel including admin check
    const [user, total, sellItems] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
      }),
      prisma.userSellItem.count(),
      prisma.userSellItem.findMany({
        select: {
          id: true,
          userId: true,
          catalogId: true,
          name: true,
          description: true,
          price: true,
          image: true,
          bankName: true,
          bankAccount: true,
          status: true,
          adminNote: true,
          acceptedSellPolicy: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          catalog: {
            select: {
              id: true,
              name: true,
              icon: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    // Check admin or owner role after parallel fetch
    if (!user || ((user.role !== "admin" && user.role !== "owner"))) {
      return NextResponse.json(
        { error: "Forbidden - Admin only" },
        { status: 403 }
      );
    }

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      sellItems,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching sell items:", error);
    return NextResponse.json(
      { error: "Failed to fetch sell items" },
      { status: 500 }
    );
  }
}

// DELETE - Delete user sell item (owner only)
export async function DELETE(request: NextRequest) {
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
    const itemId = searchParams.get("id");

    if (!itemId) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 }
      );
    }

    await prisma.userSellItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json({
      success: true,
      message: "Sell item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting sell item:", error);
    return NextResponse.json(
      { error: "Failed to delete sell item" },
      { status: 500 }
    );
  }
}
