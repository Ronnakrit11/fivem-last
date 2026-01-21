import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
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

    // Get query parameters for pagination - parse early
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Fetch all data in parallel including admin check
    const [user, transactions, totalCount, totalAmount] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
      }),
      prisma.verifiedSlip.findMany({
        skip,
        take: limit,
        orderBy: {
          verifiedAt: "desc",
        },
        select: {
          id: true,
          transRef: true,
          amount: true,
          userId: true,
          verifiedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.verifiedSlip.count(),
      prisma.verifiedSlip.aggregate({
        _sum: {
          amount: true,
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

    return NextResponse.json({
      transactions: transactions.map((t) => ({
        id: t.id,
        transRef: t.transRef,
        amount: t.amount,
        userId: t.userId,
        userName: t.user?.name || "ไม่ระบุ",
        userEmail: t.user?.email || "ไม่ระบุ",
        verifiedAt: t.verifiedAt,
      })),
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
      stats: {
        totalAmount: totalAmount._sum.amount || 0,
        totalTransactions: totalCount,
      },
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
