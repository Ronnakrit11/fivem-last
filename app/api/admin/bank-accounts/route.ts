import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const bankAccounts = await prisma.bankAccount.findMany({
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ success: true, data: bankAccounts });
  } catch (error) {
    console.error("Error fetching bank accounts:", error);
    return NextResponse.json(
      { error: "Failed to fetch bank accounts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { bankName, accountNumber, accountName, isActive, qrCodeUrl } = body;

    if (!bankName || !accountNumber || !accountName) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลให้ครบถ้วน" },
        { status: 400 }
      );
    }

    // Get max sort order
    const maxOrder = await prisma.bankAccount.aggregate({
      _max: { sortOrder: true },
    });

    const bankAccount = await prisma.bankAccount.create({
      data: {
        bankName,
        accountNumber,
        accountName,
        qrCodeUrl: qrCodeUrl || null,
        isActive: isActive ?? true,
        sortOrder: (maxOrder._max.sortOrder ?? 0) + 1,
      },
    });

    return NextResponse.json({ success: true, data: bankAccount });
  } catch (error) {
    console.error("Error creating bank account:", error);
    return NextResponse.json(
      { error: "Failed to create bank account" },
      { status: 500 }
    );
  }
}
