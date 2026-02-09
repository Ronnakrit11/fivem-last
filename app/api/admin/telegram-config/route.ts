import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET - Get telegram config
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
      select: { role: true },
    });

    if (!user || (user.role !== "admin" && user.role !== "owner")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const config = await prisma.telegramConfig.findFirst();

    return NextResponse.json({
      success: true,
      config: config || { botToken: "", chatId: "", isActive: true },
    });
  } catch (error) {
    console.error("Error fetching telegram config:", error);
    return NextResponse.json(
      { error: "Failed to fetch config" },
      { status: 500 }
    );
  }
}

// POST - Create or update telegram config
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

    const body = await request.json();
    const { botToken, chatId, isActive } = body;

    const existing = await prisma.telegramConfig.findFirst();

    let config;
    if (existing) {
      config = await prisma.telegramConfig.update({
        where: { id: existing.id },
        data: {
          botToken: botToken ?? existing.botToken,
          chatId: chatId ?? existing.chatId,
          isActive: isActive ?? existing.isActive,
        },
      });
    } else {
      config = await prisma.telegramConfig.create({
        data: {
          botToken: botToken || "",
          chatId: chatId || "",
          isActive: isActive ?? true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      config,
    });
  } catch (error) {
    console.error("Error saving telegram config:", error);
    return NextResponse.json(
      { error: "Failed to save config" },
      { status: 500 }
    );
  }
}
