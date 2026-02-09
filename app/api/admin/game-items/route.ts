import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET - Get all game items
export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin roles
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch all data in parallel including admin checksss
    const [user, gameItems] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
      }),
      prisma.gameItem.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          image: true,
          price: true,
          isCustomPrice: true,
          stock: true,
          isUnlimitedStock: true,
          isAuction: true,
          auctionEndDate: true,
          auctionFile: true,
          isActive: true,
          sort: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { sort: "asc" },
      }),
    ]);
    



    // Check admin or owner role after parallel fetch
    if (!user || ((user.role !== "admin" && user.role !== "owner"))) {
      return NextResponse.json(
        { error: "Forbidden - Admin only" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      items: gameItems,
    });
  } catch (error) {
    console.error("Error fetching game items:", error);
    return NextResponse.json(
      { error: "Failed to fetch game items" },
      { status: 500 }
    );
  }
}

// PATCH - Update sort order
export async function PATCH(request: NextRequest) {
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
      return NextResponse.json({ error: "Forbidden - Admin only" }, { status: 403 });
    }

    const body = await request.json();
    const { items } = body as { items: { id: string; sort: number }[] };

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: "Items array is required" }, { status: 400 });
    }

    await prisma.$transaction(
      items.map((item) =>
        prisma.gameItem.update({
          where: { id: item.id },
          data: { sort: item.sort },
        })
      )
    );

    return NextResponse.json({ success: true, message: "Sort order updated" });
  } catch (error) {
    console.error("Error updating sort order:", error);
    return NextResponse.json({ error: "Failed to update sort order" }, { status: 500 });
  }
}

// POST - Create new game item
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

    if (!user || ((user.role !== "admin" && user.role !== "owner"))) {
      return NextResponse.json(
        { error: "Forbidden - Admin only" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, description, image, price, isCustomPrice, stock, isUnlimitedStock, isAuction, auctionEndDate, auctionFile } = body;

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

    const gameItem = await prisma.gameItem.create({
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
        auctionFile: isAuction ? (auctionFile || null) : null,
      },
    });

    return NextResponse.json({
      success: true,
      item: gameItem,
      message: "Game item created successfully",
    });
  } catch (error) {
    console.error("Error creating game item:", error);
    return NextResponse.json(
      { error: "Failed to create game item" },
      { status: 500 }
    );
  }
}
