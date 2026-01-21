import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Get active policy (public)
export async function GET() {
  try {
    const policy = await prisma.policy.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      policy,
    });
  } catch (error) {
    console.error("Error fetching policy:", error);
    return NextResponse.json(
      { error: "Failed to fetch policy" },
      { status: 500 }
    );
  }
}
