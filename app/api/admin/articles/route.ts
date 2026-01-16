import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

// GET - List all articles
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

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin only" },
        { status: 403 }
      );
    }

    // Fetch all articles
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        keywords: true,
        slug: true,
        coverImage: true,
        published: true,
        authorId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ articles });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

// POST - Create new article
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin only" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, keywords, slug, coverImage, content, published } = body;

    // Validate required fields
    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Title, slug, and content are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingArticle = await prisma.article.findUnique({
      where: { slug },
    });

    if (existingArticle) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 400 }
      );
    }

    // Create article
    const article = await prisma.article.create({
      data: {
        title,
        description: description || "",
        keywords: keywords || "",
        slug,
        coverImage: coverImage || null,
        content,
        published: published || false,
        authorId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      article,
      message: "Article created successfully",
    });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    );
  }
}
