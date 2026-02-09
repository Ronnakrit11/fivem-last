import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET - List all real products (admin)
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user || (user.role !== "admin" && user.role !== "owner")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const items = await prisma.realProduct.findMany({
      orderBy: { sort: "asc" },
    });

    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error("Error fetching real products:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Create new real product
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user || (user.role !== "admin" && user.role !== "owner")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, image, price, stock } = body;

    if (!name) {
      return NextResponse.json({ error: "กรุณากรอกชื่อสินค้า" }, { status: 400 });
    }

    const item = await prisma.realProduct.create({
      data: {
        name,
        description: description || "",
        image: image || "",
        price: parseFloat(price) || 0,
        stock: parseInt(stock) || 0,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error("Error creating real product:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH - Update sort order
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user || (user.role !== "admin" && user.role !== "owner")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { items } = body;

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    await prisma.$transaction(
      items.map((item: { id: string; sort: number }) =>
        prisma.realProduct.update({
          where: { id: item.id },
          data: { sort: item.sort },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating sort:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
