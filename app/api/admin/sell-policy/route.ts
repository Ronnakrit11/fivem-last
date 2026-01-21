import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET - Get all sell policies (admin only)
export async function GET(request: NextRequest) {
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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin only" },
        { status: 403 }
      );
    }

    const policies = await prisma.sellPolicy.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      policies,
    });
  } catch (error) {
    console.error("Error fetching sell policies:", error);
    return NextResponse.json(
      { error: "Failed to fetch sell policies" },
      { status: 500 }
    );
  }
}

// POST - Create or update sell policy (admin only)
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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin only" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, title, content, isActive } = body;

    if (!content) {
      return NextResponse.json(
        { error: "กรุณาระบุเนื้อหานโยบาย" },
        { status: 400 }
      );
    }

    let policy;

    if (id) {
      // Update existing policy
      policy = await prisma.sellPolicy.update({
        where: { id },
        data: {
          title: title || "นโยบายการขายสินค้า",
          content,
          isActive: isActive !== undefined ? isActive : true,
        },
      });
    } else {
      // Create new policy
      policy = await prisma.sellPolicy.create({
        data: {
          title: title || "นโยบายการขายสินค้า",
          content,
          isActive: isActive !== undefined ? isActive : true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      policy,
      message: id ? "อัปเดตนโยบายการขายสำเร็จ" : "สร้างนโยบายการขายสำเร็จ",
    });
  } catch (error) {
    console.error("Error saving sell policy:", error);
    return NextResponse.json(
      { error: "Failed to save sell policy" },
      { status: 500 }
    );
  }
}
