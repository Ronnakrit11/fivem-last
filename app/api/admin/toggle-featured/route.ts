import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== "admin" && user?.role !== "owner") {
      return NextResponse.json(
        { error: "Forbidden - Admin only" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { productId, isFeatured } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    if (isFeatured) {
      // Add to featured
      await prisma.featuredProduct.upsert({
        where: { productId: productId.toString() },
        create: { productId: productId.toString() },
        update: {},
      });
    } else {
      // Remove from featured
      await prisma.featuredProduct.deleteMany({
        where: { productId: productId.toString() },
      });
    }

    // Revalidate homepage to show updated featured products
    revalidatePath("/");
    revalidatePath("/admin/products");

    return NextResponse.json({
      success: true,
      isFeatured: isFeatured,
    });
  } catch (error) {
    console.error("Error toggling featured status:", error);
    return NextResponse.json(
      { error: "Failed to toggle featured status" },
      { status: 500 }
    );
  }
}
