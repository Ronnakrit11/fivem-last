import { NextRequest, NextResponse } from "next/server";
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

    // Check admin or owner role after parallel fetch
    if (!user || ((user.role !== "admin" && user.role !== "owner"))) {
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

// PUT - Update user (owner only)
export async function PUT(request: NextRequest) {
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

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    // Only owner can edit users
    if (!currentUser || currentUser.role !== "owner") {
      return NextResponse.json(
        { error: "Forbidden - Owner only" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, name, email, role, balance } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(role !== undefined && { role }),
        ...(balance !== undefined && { balance: parseFloat(balance) }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        balance: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE - Delete user (owner only)
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

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    // Only owner can delete users
    if (!currentUser || currentUser.role !== "owner") {
      return NextResponse.json(
        { error: "Forbidden - Owner only" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Prevent deleting self
    if (userId === session.user.id) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    // Delete related records first
    await prisma.$transaction([
      prisma.session.deleteMany({ where: { userId } }),
      prisma.account.deleteMany({ where: { userId } }),
      prisma.user.delete({ where: { id: userId } }),
    ]);

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
