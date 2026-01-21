import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// POST - Accept policy for current user
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

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        acceptedPolicy: true,
        acceptedPolicyAt: new Date(),
      },
      select: {
        id: true,
        acceptedPolicy: true,
        acceptedPolicyAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error accepting policy:", error);
    return NextResponse.json(
      { error: "Failed to accept policy" },
      { status: 500 }
    );
  }
}
