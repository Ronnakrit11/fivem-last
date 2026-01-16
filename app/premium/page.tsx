import PremiumClient from "./premium-client";

interface Product {
  id: number;
  name: string;
  price: number;
  pricevip: number;
  agent_price: number;
  stock: number;
  img: string;
  des: string;
}

// Metadata for SEO
export const metadata = {
  title: "แอพพรีเมี่ยม | Premium Apps",
  description: "สินค้าแอพพรีเมี่ยมคุณภาพสูง พร้อมส่งทันที ราคาถูก บริการรวดเร็ว",
  keywords: ["premium apps", "แอพพรีเมี่ยม", "ซื้อแอพ", "apps store"],
};

// Disable caching to always get fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getProducts(): Promise<Product[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/products`, {
      cache: 'no-store',
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.data || [];
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  }
  return [];
}

export default async function PremiumPage() {
  // Fetch products only (session check is handled by Layout + client component)
  const products = await getProducts();

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PremiumClient initialProducts={products} />
      </div>
    </div>
  );
}
