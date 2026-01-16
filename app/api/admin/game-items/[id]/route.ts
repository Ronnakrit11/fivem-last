import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// PUT - Update game item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
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

    const body = await request.json();
    const { name, description, image, price, isActive, isCustomPrice, stock, isUnlimitedStock, isAuction, auctionEndDate } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    // If auction, require end date
    if (isAuction && !auctionEndDate) {
      return NextResponse.json(
        { error: "Auction end date is required for auction items" },
        { status: 400 }
      );
    }

    // If not custom price and not auction, price is required
    if (!isCustomPrice && !isAuction && !price) {
      return NextResponse.json(
        { error: "Price is required when not using custom price" },
        { status: 400 }
      );
    }

    const gameItem = await prisma.gameItem.update({
      where: { id },
      data: {
        name,
        description: description || "",
        image: image || "",
        price: (isCustomPrice || isAuction) ? 0 : parseFloat(price),
        isCustomPrice: isAuction ? false : (isCustomPrice || false),
        stock: (isUnlimitedStock || isAuction) ? 0 : parseInt(stock) || 0,
        isUnlimitedStock: isAuction ? false : (isUnlimitedStock !== false),
        isAuction: isAuction || false,
        auctionEndDate: isAuction ? new Date(auctionEndDate) : null,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({
      success: true,
      item: gameItem,
      message: "Game item updated successfully",
    });
  } catch (error) {
    console.error("Error updating game item:", error);
    return NextResponse.json(
      { error: "Failed to update game item" },
      { status: 500 }
    );
  }
}

// DELETE - Delete game item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
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

    await prisma.gameItem.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Game item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting game item:", error);
    return NextResponse.json(
      { error: "Failed to delete game item" },
      { status: 500 }
    );
  }
}
