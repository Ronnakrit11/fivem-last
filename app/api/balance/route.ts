import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET - ดึงยอดเงินของ user
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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { balance: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ balance: user.balance });
  } catch (error) {
    console.error("Error fetching balance:", error);
    return NextResponse.json(
      { error: "Failed to fetch balance" },
      { status: 500 }
    );
  }
}

// POST - อัพเดทยอดเงิน (เติมเงิน/หักเงิน)
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { amount, type } = body; // type: 'add' | 'subtract'

    if (!amount || !type) {
      return NextResponse.json(
        { error: "Amount and type are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    let newBalance: number;
    if (type === "add") {
      newBalance = user.balance + parseFloat(amount);
    } else if (type === "subtract") {
      newBalance = user.balance - parseFloat(amount);
      if (newBalance < 0) {
        return NextResponse.json(
          { error: "ยอดเงินไม่เพียงพอ" },
          
          
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Invalid type" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { balance: newBalance },
    });

    return NextResponse.json({
      success: true,
      balance: updatedUser.balance,
    });
  } catch (error) {
    console.error("Error updating balance:", error);
    return NextResponse.json(
      { error: "Failed to update balance" },
      { status: 500 }
    );
  }
}
