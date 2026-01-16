import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function POST() {
  try {
    // Check authentication and admin role
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Please login." },
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
        { error: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    const apiKey = process.env.PEAMSUB_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "API Key not configured" },
        { status: 500 }
      );
    }

    // Fetch products from peamsub
    const encodedKey = Buffer.from(apiKey).toString("base64");

    const response = await fetch(
      "https://api.peamsub24hr.com/v2/app-premium",
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${encodedKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.data || !Array.isArray(data.data)) {
      return NextResponse.json(
        { error: "Invalid response from peamsub" },
        { status: 500 }
      );
    }

    // Sync products to database using upsert
    const syncResults = await Promise.all(
      data.data.map(async (product: {
        id: number;
        name: string;
        price: number;
        pricevip: number;
        agent_price: number;
        img: string;
        des: string;
      }) => {
        // Check if there's a custom price override
        const customPrice = await prisma.productPrice.findUnique({
          where: { productId: product.id.toString() },
        });

        const finalPrice = customPrice ? customPrice.price : product.price;

        return prisma.product.upsert({
          where: { id: product.id.toString() },
          update: {
            name: product.name,
            price: finalPrice,
            pricevip: product.pricevip,
            agent_price: product.agent_price,
            img: product.img,
            des: product.des || "",
            updatedAt: new Date(),
          },
          create: {
            id: product.id.toString(),
            name: product.name,
            price: finalPrice,
            pricevip: product.pricevip,
            agent_price: product.agent_price,
            img: product.img,
            des: product.des || "",
          },
        });
      })
    );

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${syncResults.length} products`,
      count: syncResults.length,
    });
  } catch (error) {
    console.error("Error syncing products:", error);
    return NextResponse.json(
      { error: "Failed to sync products" },
      { status: 500 }
    );
  }
}
