import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Get active purchase policy (public)
export async function GET() {
  try {
    const policy = await prisma.purchasePolicy.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      policy,
    });
  } catch (error) {
    console.error("Error fetching purchase policy:", error);
    return NextResponse.json(
      { error: "Failed to fetch purchase policy" },
      { status: 500 }
    );
  }
}
