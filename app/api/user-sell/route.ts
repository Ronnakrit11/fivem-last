import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// POST - Create new sell item
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "กรุณาเข้าสู่ระบบก่อน" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, description, price, image, catalogId } = body;

    if (!name || !description || !price) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลให้ครบถ้วน" },
        { status: 400 }
      );
    }

    if (price <= 0) {
      return NextResponse.json(
        { error: "ราคาต้องมากกว่า 0" },
        { status: 400 }
      );
    }

    const sellItem = await prisma.userSellItem.create({
      data: {
        userId: session.user.id,
        name,
        description,
        price: parseFloat(price),
        image: image || null,
        catalogId: catalogId || null,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      sellItem,
      message: "ส่งรายการขายสำเร็จ รอแอดมินตรวจสอบ",
    });
  } catch (error) {
    console.error("Error creating sell item:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}

// GET - Get user's sell items
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

    const sellItems = await prisma.userSellItem.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      sellItems,
    });
  } catch (error) {
    console.error("Error fetching sell items:", error);
    return NextResponse.json(
      { error: "Failed to fetch sell items" },
      { status: 500 }
    );
  }
}
