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

    // Get today's date range - compute early
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Fetch all data in parallel including admin check
    const [user, totalUsers, totalSales, todayOrders, totalOrders] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
      }),
      // จำนวนผู้ใช้ทั้งหมด
      prisma.user.count(),
      
      // ยอดขายทั้งหมด (จาก GameItemOrder ที่อนุมัติแล้ว)
      prisma.gameItemOrder.aggregate({
        where: { 
          status: { in: ["APPROVED", "COMPLETED"] }
        },
        _sum: { amount: true },
      }),
      
      // คำสั่งซื้อวันนี้
      prisma.gameItemOrder.count({
        where: {
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),
      
      // จำนวนการขายทั้งหมดในระบบ
      prisma.gameItemOrder.count(),
    ]);

    // Check admin or owner role after parallel fetch
    if (!user || ((user.role !== "admin" && user.role !== "owner"))) {
      return NextResponse.json(
        { error: "Forbidden - Admin only" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      totalUsers,
      totalSales: totalSales._sum.amount || 0,
      todayOrders,
      totalOrders,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
