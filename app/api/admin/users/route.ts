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

    // Get pagination parameters - parse early
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Start all queries in parallel including admin check
    const [user, totalUsers, users] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
      }),
      prisma.user.count(),
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          balance: true,
          role: true,
          acceptedPolicy: true,
          acceptedPolicyAt: true,
          fullName: true,
          phone: true,
          bankName: true,
          bankAccountReceive: true,
          bankAccountTransfer: true,
          otherBankName: true,
          profileCompleted: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ]);

    // Check admin role after parallel fetch
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin only" },
        { status: 403 }
      );
    }

    // Get user IDs for batch query
    const userIds = users.map(u => u.id);

    // Batch query: Get purchase stats for all users at once using groupBy
    const orderStats = await prisma.gameItemOrder.groupBy({
      by: ['userId'],
      where: {
        userId: { in: userIds },
        status: { in: ["APPROVED", "COMPLETED"] },
      },
      _count: { id: true },
      _sum: { amount: true },
    });

    // Create a map for quick lookup
    const statsMap = new Map(
      orderStats.map(stat => [
        stat.userId,
        { count: stat._count.id, total: stat._sum.amount || 0 }
      ])
    );

    // Merge stats with users
    const usersWithStats = users.map(user => ({
      ...user,
      purchaseCount: statsMap.get(user.id)?.count || 0,
      totalSpent: statsMap.get(user.id)?.total || 0,
    }));

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
