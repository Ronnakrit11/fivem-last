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

    if (user?.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin only" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { productId, price } = body;

    if (!productId || !price) {
      return NextResponse.json(
        { error: "Product ID and price are required" },
        { status: 400 }
      );
    }

    // Upsert product price override
    const productPrice = await prisma.productPrice.upsert({
      where: { productId: productId.toString() },
      update: {
        price: parseFloat(price),
        updatedBy: session.user.id,
        updatedAt: new Date(),
      },
      create: {
        productId: productId.toString(),
        price: parseFloat(price),
        updatedBy: session.user.id,
      },
    });

    // Also update price in Product table if it exists
    const product = await prisma.product.findUnique({
      where: { id: productId.toString() },
    });

    if (product) {
      await prisma.product.update({
        where: { id: productId.toString() },
        data: {
          price: parseFloat(price),
          updatedAt: new Date(),
        },
      });
    }

    // Revalidate pages that show products
    revalidatePath("/");
    revalidatePath("/premium");
    revalidatePath("/admin/products");

    return NextResponse.json({
      success: true,
      data: productPrice,
    });
  } catch (error) {
    console.error("Error updating product price:", error);
    return NextResponse.json(
      { error: "Failed to update price" },
      { status: 500 }
    );
  }
}
