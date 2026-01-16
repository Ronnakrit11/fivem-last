import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Disable caching - always fetch fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    // Get active game items
    const gameItems = await prisma.gameItem.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: gameItems,
    });
  } catch (error) {
    console.error("Error fetching game items:", error);
    return NextResponse.json(
      { success: false, data: [], error: "Failed to fetch game items" },
      { status: 500 }
    );
  }
}
