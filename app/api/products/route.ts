import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Disable caching to always get fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const apiKey = process.env.PEAMSUB_API_KEY;

    // Parallel execution: Fetch DB products and external API simultaneously
    const [dbProducts, externalData] = await Promise.allSettled([
      // Query 1: Get products from database
      prisma.product.findMany({
        where: { active: true },
        orderBy: { updatedAt: "desc" },
      }),
      // Query 2: Fetch from external API (if API key exists)
      apiKey
        ? fetch("https://api.peamsub24hr.com/v2/app-premium", {
            method: "GET",
            headers: {
              Authorization: `Basic ${Buffer.from(apiKey).toString("base64")}`,
              "Content-Type": "application/json",
            },
            next: { revalidate: 30 }, // Cache for 30 seconds
          }).then(res => (res.ok ? res.json() : null))
        : Promise.resolve(null),
    ]);

    // Handle DB products result
    let products =
      dbProducts.status === "fulfilled" ? dbProducts.value : [];

    // If no products in DB, sync from external API
    if (products.length === 0 && externalData.status === "fulfilled" && externalData.value) {
      console.log("No products in database, syncing from peamsub...");
      
      const syncData = externalData.value;
      
      if (syncData.data && Array.isArray(syncData.data)) {
        // Batch fetch all custom prices at once
        const productIds = syncData.data.map((p: { id: number }) => p.id.toString());
        const customPrices = await prisma.productPrice.findMany({
          where: { productId: { in: productIds } },
        });
        const priceMap = new Map(customPrices.map(p => [p.productId, p.price]));

        // Batch upsert all products
        await prisma.$transaction(
          syncData.data.map((product: {
            id: number;
            name: string;
            price: number;
            pricevip: number;
            agent_price: number;
            img: string;
            des: string;
          }) =>
            prisma.product.upsert({
              where: { id: product.id.toString() },
              update: {
                name: product.name,
                price: priceMap.get(product.id.toString()) ?? product.price,
                pricevip: product.pricevip,
                agent_price: product.agent_price,
                img: product.img,
                des: product.des || "",
                updatedAt: new Date(),
              },
              create: {
                id: product.id.toString(),
                name: product.name,
                price: priceMap.get(product.id.toString()) ?? product.price,
                pricevip: product.pricevip,
                agent_price: product.agent_price,
                img: product.img,
                des: product.des || "",
              },
            })
          )
        );

        console.log(`Synced ${syncData.data.length} products to database`);

        // Re-fetch products after sync
        products = await prisma.product.findMany({
          where: { active: true },
          orderBy: { updatedAt: "desc" },
        });
      }
    }

    // Build stock map from external data
    const stockMap = new Map<string, number>();
    if (externalData.status === "fulfilled" && externalData.value?.data) {
      externalData.value.data.forEach((item: { id: number; stock: number }) => {
        stockMap.set(item.id.toString(), item.stock || 0);
      });
    }

    // Merge products with stock data
    const productsWithStock = products.map(product => ({
      id: parseInt(product.id),
      name: product.name,
      price: Number(product.price),
      pricevip: Number(product.pricevip),
      agent_price: Number(product.agent_price),
      img: product.img,
      des: product.des,
      stock: stockMap.get(product.id) || 0,
    }));

    return NextResponse.json({ data: productsWithStock });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
