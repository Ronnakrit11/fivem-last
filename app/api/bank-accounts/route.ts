import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const bankAccounts = await prisma.bankAccount.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        bankName: true,
        accountNumber: true,
        accountName: true,
        qrCodeUrl: true,
        accountType: true,
      },
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
