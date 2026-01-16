import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { put } from "@vercel/blob";

export async function POST(request: NextRequest) {
  try {
    // Check authentication (any logged in user can upload)
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "กรุณาเข้าสู่ระบบก่อน" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "ไม่พบไฟล์" },
        { status: 400 }
      );
    }

    // Check file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "รองรับเฉพาะไฟล์รูปภาพ (JPG, PNG, WEBP)" },
        { status: 400 }
      );
    }

    // Check file size (max 5MB for slips)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "ไฟล์ใหญ่เกินไป (สูงสุด 5MB)" },
        { status: 400 }
      );
    }

    // Upload to Vercel Blob
    const filename = `slips/${session.user.id}/${Date.now()}-${file.name}`;
    const blob = await put(filename, file, {
      access: "public",
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
    });
  } catch (error) {
    console.error("Error uploading slip:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการอัพโหลด" },
      { status: 500 }
    );
  }
}
