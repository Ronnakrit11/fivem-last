import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Get published articles for public viewing
export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      where: {
        published: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 6, // Limit to 6 most recent articles
      select: {
        id: true,
        title: true,
        description: true,
        slug: true,
        coverImage: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      articles,
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}
