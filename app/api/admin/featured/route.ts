import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const featuredProducts = await prisma.featuredProduct.findMany({
      select: { productId: true },
    });

    return NextResponse.json({
      featuredIds: featuredProducts.map(f => f.productId),
    });
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured products", featuredIds: [] },
      { status: 500 }
    );
  }
}
