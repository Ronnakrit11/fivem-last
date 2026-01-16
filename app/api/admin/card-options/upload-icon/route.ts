import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// POST - Upload icon for card option
export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user with role from database
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

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Check file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only images are allowed." },
        { status: 400 }
      );
    }

    // Check file size (max 2MB for icons)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 2MB." },
        { status: 400 }
      );
    }

    // Upload to Vercel Blob
    const filename = `card-options/icons/${Date.now()}-${file.name}`;
    const blob = await put(filename, file, {
      access: "public",
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
      message: "Card option icon uploaded successfully",
    });
  } catch (error) {
    console.error("Error uploading card option icon:", error);
    return NextResponse.json(
      { error: "Failed to upload card option icon" },
      { status: 500 }
    );
  }
}
