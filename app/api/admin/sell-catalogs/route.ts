import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET - Get all sell catalogs
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || (user.role !== "admin" && user.role !== "owner" && user.role !== "superadmin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const catalogs = await prisma.sellCatalog.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: { sellItems: true },
        },
      },
    });

    return NextResponse.json({ success: true, catalogs });
  } catch (error) {
    console.error("Error fetching sell catalogs:", error);
    return NextResponse.json({ error: "Failed to fetch catalogs" }, { status: 500 });
  }
}

// POST - Create new sell catalog
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || (user.role !== "admin" && user.role !== "owner" && user.role !== "superadmin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, icon, image, isActive, sortOrder } = body;

    if (!name) {
      return NextResponse.json({ error: "กรุณากรอกชื่อหมวดหมู่" }, { status: 400 });
    }

    const catalog = await prisma.sellCatalog.create({
      data: {
        name,
        description: description || "",
        icon: icon || "",
        image: image || null,
        isActive: isActive ?? true,
        sortOrder: sortOrder ?? 0,
      },
    });

    return NextResponse.json({ success: true, catalog });
  } catch (error) {
    console.error("Error creating sell catalog:", error);
    return NextResponse.json({ error: "Failed to create catalog" }, { status: 500 });
  }
}
