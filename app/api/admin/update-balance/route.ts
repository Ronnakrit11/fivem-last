import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
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
    const adminUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (adminUser?.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin only" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { userId, newBalance, action } = body;

    if (!userId || (newBalance === undefined && !action)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get current user
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true, email: true, name: true },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    let finalBalance = newBalance;

    // Handle action-based updates (add or subtract)
    if (action && action.type) {
      const amount = parseFloat(action.amount);
      if (isNaN(amount) || amount <= 0) {
        return NextResponse.json(
          { error: "Invalid amount" },
          { status: 400 }
        );
      }

      if (action.type === "add") {
        finalBalance = targetUser.balance + amount;
      } else if (action.type === "subtract") {
        finalBalance = targetUser.balance - amount;
        if (finalBalance < 0) {
          return NextResponse.json(
            { error: "Insufficient balance" },
            { status: 400 }
          );
        }
      }
    }

    // Validate balance
    if (finalBalance < 0) {
      return NextResponse.json(
        { error: "Balance cannot be negative" },
        { status: 400 }
      );
    }

    // Update user balance
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { balance: finalBalance },
      select: {
        id: true,
        name: true,
        email: true,
        balance: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Balance updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating balance:", error);
    return NextResponse.json(
      { error: "Failed to update balance" },
      { status: 500 }
    );
  }
}
