import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Get all active contact buttons (public)
export async function GET() {
  try {
    const buttons = await prisma.contactButton.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({
      success: true,
      buttons,
    });
  } catch (error) {
    console.error("Error fetching contact buttons:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact buttons" },
      { status: 500 }
    );
  }
}
