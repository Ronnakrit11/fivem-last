import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET - Get all contact buttons (admin only)
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

    const buttons = await prisma.contactButton.findMany({
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

// POST - Create new contact button (admin only)
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
    const { name, link, icon, qrCodeUrl, isActive, sortOrder } = body;

    if (!name) {
      return NextResponse.json(
        { error: "กรุณาระบุชื่อปุ่ม" },
        { status: 400 }
      );
    }

    const button = await prisma.contactButton.create({
      data: {
        name,
        link: link || "",
        icon: icon || null,
        qrCodeUrl: qrCodeUrl || null,
        isActive: isActive !== undefined ? isActive : true,
        sortOrder: sortOrder || 0,
      },
    });

    return NextResponse.json({
      success: true,
      button,
      message: "สร้างปุ่มติดต่อสำเร็จ",
    });
  } catch (error) {
    console.error("Error creating contact button:", error);
    return NextResponse.json(
      { error: "Failed to create contact button" },
      { status: 500 }
    );
  }
}
