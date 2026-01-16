import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { gameId } = await params;

    // Get current game
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      select: { isFeatured: true },
    });

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    // Toggle featured status
    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: { isFeatured: !game.isFeatured },
    });

    return NextResponse.json({
      success: true,
      isFeatured: updatedGame.isFeatured,
    });
  } catch (error) {
    console.error("Error toggling featured:", error);
    return NextResponse.json(
      { error: "Failed to toggle featured status" },
      { status: 500 }
    );
  }
}
