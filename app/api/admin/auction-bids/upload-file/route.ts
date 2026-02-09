import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { put } from "@vercel/blob";

// POST - Admin upload download file for auction bid winner
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
      select: { role: true },
    });

    if (!user || (user.role !== "admin" && user.role !== "owner")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "ไม่พบไฟล์" }, { status: 400 });
    }

    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: "ไฟล์ต้องมีขนาดไม่เกิน 50MB" },
        { status: 400 }
      );
    }

    const filename = `auction-downloads/${Date.now()}-${file.name}`;
    const blob = await put(filename, file, { access: "public" });

    return NextResponse.json({
      success: true,
      url: blob.url,
      fileName: file.name,
    });
  } catch (error) {
    console.error("Error uploading auction download file:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการอัปโหลด" },
      { status: 500 }
    );
  }
}
