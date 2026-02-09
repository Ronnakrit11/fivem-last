import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - List active real products (public)
export async function GET() {
  try {
    const items = await prisma.realProduct.findMany({
      where: { isActive: true },
      orderBy: { sort: "asc" },
    });

    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error("Error fetching real products:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
