import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering since we use headers()
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch user info (balance and role in one query)
    const userRecord = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { 
        balance: true,
        role: true,
      },
    });

    return NextResponse.json({
      id: session.user.id,
      balance: userRecord?.balance || 0,
      role: userRecord?.role || "user",
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    return NextResponse.json(
      { error: "Failed to fetch user info" },
      { status: 500 }
    );
  }
}
