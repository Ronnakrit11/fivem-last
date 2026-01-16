import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

// GET: Fetch user's purchase history from database
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

    // Fetch game item orders
    const gameItemOrders = await prisma.gameItemOrder.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        gameItem: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform to expected format
    const historyData = gameItemOrders.map(order => ({
      id: order.id,
      productName: order.gameItem?.name || "สินค้า",
      productId: order.gameItemId,
      prize: "",
      price: order.amount,
      reference: order.id.slice(0, 8).toUpperCase(),
      status: order.status === "APPROVED" || order.status === "COMPLETED" ? "success" : order.status === "REJECTED" ? "failed" : "pending",
      createdAt: order.createdAt,
      image: order.gameItem?.image || null,
    }));

    return NextResponse.json({
      data: historyData,
    });
  } catch (error) {
    console.error("Error fetching purchase history:", error);
    return NextResponse.json(
      { error: "Failed to fetch purchase history" },
      { status: 500 }
    );
  }
}

// POST: Fetch from external API (existing functionality)
export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.PEAMSUB_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "API Key not configured" },
        { status: 500 }
      );
    }

    // Encode API Key with Base64
    const encodedKey = Buffer.from(apiKey).toString("base64");

    // Get references from request body (optional)
    const body = await request.json().catch(() => ({ references: [] }));
    const references = body.references || [];

    const response = await fetch(
      "https://api.peamsub24hr.com/v2/app-premium/history",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${encodedKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          references: references,
        }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching app history:", error);
    return NextResponse.json(
      { error: "Failed to fetch app history" },
      { status: 500 }
    );
  }
}
