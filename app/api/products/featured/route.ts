import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Enable edge caching for 60 seconds
export const revalidate = 60;

export async function GET() {
  try {
    // Step 1: Get featured products with their product data in one query (no limit)
    const featuredWithProducts = await prisma.featuredProduct.findMany({
      select: {
        productId: true,
      },
    });

    if (featuredWithProducts.length === 0) {
      return NextResponse.json({ data: [] });
    }

    const productIds = featuredWithProducts.map(f => f.productId);

    // Step 2: Get product details for featured products only
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        active: true,
      },
      select: {
        id: true,
        name: true,
        price: true,
        img: true,
        des: true,
      },
    });

    if (products.length === 0) {
      return NextResponse.json({ data: [] });
    }

    // Step 3: Fetch stock from external API (parallel with DB queries above)
    const apiKey = process.env.PEAMSUB_API_KEY;
    
    if (!apiKey) {
      // Return products with stock = 0 if no API key
      const productsWithZeroStock = products.map(p => ({
        id: parseInt(p.id),
        name: p.name,
        price: Number(p.price),
        img: p.img,
        des: p.des,
        stock: 0,
      }));
      
      return NextResponse.json({ data: productsWithZeroStock });
    }

    const encodedKey = Buffer.from(apiKey).toString("base64");
    
    // Fetch stock with timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
    
    const stockMap = new Map<string, number>();
    
    try {
      const stockResponse = await fetch(
        "https://api.peamsub24hr.com/v2/app-premium",
        {
          method: "GET",
          headers: {
            Authorization: `Basic ${encodedKey}`,
            "Content-Type": "application/json",
          },
          signal: controller.signal,
          next: { revalidate: 30 }, // Cache stock for 30 seconds
        }
      );

      clearTimeout(timeoutId);

      if (stockResponse.ok) {
        const stockData = await stockResponse.json();
        
        if (stockData.data && Array.isArray(stockData.data)) {
          stockData.data.forEach((item: { id: number; stock: number }) => {
            stockMap.set(item.id.toString(), item.stock || 0);
          });
        }
      }
    } catch (error) {
      clearTimeout(timeoutId);
      console.warn("Failed to fetch stock from peamsub, using stock = 0:", error);
      // Continue with stock = 0 instead of failing
    }

    // Step 4: Merge products with stock data
    const productsWithStock = products.map(product => ({
      id: parseInt(product.id),
      name: product.name,
      price: Number(product.price),
      img: product.img,
      des: product.des,
      stock: stockMap.get(product.id) || 0,
    }));

    return NextResponse.json({
      data: productsWithStock,
    });
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return NextResponse.json(
      { data: [], error: "Failed to fetch featured products" },
      { status: 500 }
    );
  }
}
