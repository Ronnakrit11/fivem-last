import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Get single article by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ article });
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    );
  }
}

// PUT - Update article
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    // Check if article exists
    const existingArticle = await prisma.article.findUnique({
      where: { id },
    });

    if (!existingArticle) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    // If slug is being changed, check if new slug already exists
    if (slug && slug !== existingArticle.slug) {
      const slugExists = await prisma.article.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "Slug already exists" },
          { status: 400 }
        );
      }
    }

    // Update article
    const article = await prisma.article.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(keywords !== undefined && { keywords }),
        ...(slug && { slug }),
        ...(coverImage !== undefined && { coverImage }),
        ...(content && { content }),
        ...(published !== undefined && { published }),
      },
    });

    return NextResponse.json({
      success: true,
      article,
      message: "Article updated successfully",
    });
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 }
    );
  }
}

// DELETE - Delete article
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    // Check if article exists
    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    // Delete article
    await prisma.article.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 }
    );
  }
}
