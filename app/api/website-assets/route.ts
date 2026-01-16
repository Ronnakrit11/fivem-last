import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.websiteSettings.findFirst({
      select: {
        logoUrl: true,
        bannerUrl: true,
      },
    });

    return NextResponse.json({
      logoUrl: settings?.logoUrl || null,
      bannerUrl: settings?.bannerUrl || null,
    });
  } catch (error) {
    console.error("Error fetching website assets:", error);
    return NextResponse.json(
      { error: "Failed to fetch website assets" },
      { status: 500 }
    );
  }
}
