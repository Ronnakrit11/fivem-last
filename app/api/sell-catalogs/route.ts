import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Get all active sell catalogs (public API for users)
export async function GET() {
  try {
    const catalogs = await prisma.sellCatalog.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        name: true,
        description: true,
        icon: true,
      },
    });

    return NextResponse.json({ success: true, catalogs });
  } catch (error) {
    console.error("Error fetching sell catalogs:", error);
    return NextResponse.json({ error: "Failed to fetch catalogs" }, { status: 500 });
  }
}
