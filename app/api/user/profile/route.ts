import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET - Get user profile
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
      select: {
        id: true,
        name: true,
        email: true,
        fullName: true,
        phone: true,
        bankName: true,
        bankAccountReceive: true,
        bankAccountTransfer: true,
        otherBankName: true,
        bankNameTransfer: true,
        otherBankNameTransfer: true,
        profileCompleted: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// POST - Update user profile
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

    const body = await request.json();
    const { fullName, phone, bankName, bankAccountReceive, bankAccountTransfer, otherBankName, bankNameTransfer, otherBankNameTransfer } = body;

    // Validate required fields
    if (!fullName || !phone) {
      return NextResponse.json(
        { error: "กรุณากรอกชื่อ-นามสกุลและเบอร์โทรศัพท์" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        bankName: bankName?.trim() || "",
        bankAccountReceive: bankAccountReceive?.trim() || "",
        bankAccountTransfer: bankAccountTransfer?.trim() || "",
        otherBankName: otherBankName?.trim() || "",
        bankNameTransfer: bankNameTransfer?.trim() || "",
        otherBankNameTransfer: otherBankNameTransfer?.trim() || "",
        profileCompleted: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        fullName: true,
        phone: true,
        bankName: true,
        bankAccountReceive: true,
        bankAccountTransfer: true,
        otherBankName: true,
        bankNameTransfer: true,
        otherBankNameTransfer: true,
        profileCompleted: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: "บันทึกข้อมูลสำเร็จ",
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
