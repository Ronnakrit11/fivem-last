import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET - Get all policies (admin only)
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

    if (!user || (user.role !== "admin" && user.role !== "owner")) {
      return NextResponse.json(
        { error: "Forbidden - Admin only" },
        { status: 403 }
      );
    }

    const policies = await prisma.policy.findMany({
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
    console.error("Error fetching policies:", error);
    return NextResponse.json(
      { error: "Failed to fetch policies" },
      { status: 500 }
    );
  }
}

// POST - Create or update policy (admin only)
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

    if (!user || (user.role !== "admin" && user.role !== "owner")) {
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
      policy = await prisma.policy.update({
        where: { id },
        data: {
          title: title || "นโยบายความเป็นส่วนตัว",
          content,
          isActive: isActive !== undefined ? isActive : true,
        },
      });
    } else {
      // Create new policy
      policy = await prisma.policy.create({
        data: {
          title: title || "นโยบายความเป็นส่วนตัว",
          content,
          isActive: isActive !== undefined ? isActive : true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      policy,
      message: id ? "อัปเดตนโยบายสำเร็จ" : "สร้างนโยบายสำเร็จ",
    });
  } catch (error) {
    console.error("Error saving policy:", error);
    return NextResponse.json(
      { error: "Failed to save policy" },
      { status: 500 }
    );
  }
}
