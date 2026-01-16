import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
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

    // Get pagination parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Get total count
    const totalUsers = await prisma.user.count();

    // Fetch users with pagination
    const users = await prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        balance: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Get purchase counts for each user from GameItemOrder
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const purchaseCount = await prisma.gameItemOrder.count({
          where: {
            userId: user.id,
            status: { in: ["APPROVED", "COMPLETED"] },
          },
        });

        const totalSpent = await prisma.gameItemOrder.aggregate({
          where: {
            userId: user.id,
            status: { in: ["APPROVED", "COMPLETED"] },
          },
          _sum: { amount: true },
        });

        return {
          ...user,
          purchaseCount,
          totalSpent: totalSpent._sum.amount || 0,
        };
      })
    );

    return NextResponse.json({
      users: usersWithStats,
      pagination: {
        total: totalUsers,
        page,
        limit,
        totalPages: Math.ceil(totalUsers / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
