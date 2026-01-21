import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Get active sell policy (public)
export async function GET() {
  try {
    const policy = await prisma.sellPolicy.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      policy,
    });
  } catch (error) {
    console.error("Error fetching sell policy:", error);
    return NextResponse.json(
      { error: "Failed to fetch sell policy" },
      { status: 500 }
    );
  }
}
