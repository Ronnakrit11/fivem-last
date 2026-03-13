import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

async function checkAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized", status: 401 };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "admin" && user?.role !== "owner") {
    return { error: "Forbidden", status: 403 };
  }

  return { user: session.user };
}

const defaultSections = {
  games: {
    title: "เติมเกมยอดนิยม",
    subtitle: "เติมเกมรวดเร็ว ปลอดภัย ราคาถูก",
    visible: true,
    glowColor: "rgba(99, 102, 241, 0.2)",
    titleColor: "#ffffff",
    cardBgColor: "rgba(30, 41, 59, 0.5)",
    cardTextColor: "#ffffff",
    buttonColor: "#6366f1",
    buttonTextColor: "#ffffff",
  },
  cards: {
    title: "บัตรเติมเงินยอดนิยม",
    subtitle: "ซื้อบัตรเติมเงินได้ทันที ราคาประหยัด",
    visible: true,
    glowColor: "rgba(16, 185, 129, 0.2)",
    titleColor: "#ffffff",
    cardBgColor: "rgba(30, 41, 59, 0.5)",
    cardTextColor: "#ffffff",
    buttonColor: "#10b981",
    buttonTextColor: "#ffffff",
  },
  realProducts: {
    title: "สินค้าบริษัท",
    subtitle: "สินค้าจริงจากบริษัท คุณภาพดี จัดส่งรวดเร็ว",
    visible: true,
    glowColor: "rgba(244, 63, 94, 0.2)",
    titleColor: "#ffffff",
    cardBgColor: "rgba(30, 41, 59, 0.5)",
    cardTextColor: "#ffffff",
    buttonColor: "#f43f5e",
    buttonTextColor: "#ffffff",
  },
  products: {
    title: "สินค้าของเรา",
    subtitle: "สินค้าพร้อมส่งทันที อัปเดตตลอดเวลา ราคาคุ้มค่า",
    visible: true,
    glowColor: "rgba(168, 85, 247, 0.2)",
    titleColor: "#ffffff",
    cardBgColor: "rgba(30, 41, 59, 0.5)",
    cardTextColor: "#ffffff",
    buttonColor: "#a855f7",
    buttonTextColor: "#ffffff",
  },
  auction: {
    title: "สินค้าประมูล",
    subtitle: "ประมูลสินค้าพิเศษ เสนอราคาที่คุณต้องการ",
    visible: true,
    glowColor: "rgba(251, 191, 36, 0.2)",
    titleColor: "#ffffff",
    cardBgColor: "rgba(30, 41, 59, 0.5)",
    cardTextColor: "#ffffff",
    buttonColor: "#f59e0b",
    buttonTextColor: "#ffffff",
  },
  recentOrders: {
    title: "การสั่งซื้อล่าสุด",
    subtitle: "",
    visible: true,
  },
  sellItems: {
    visible: true,
  },
  articles: {
    visible: true,
  },
};

const defaultTrustBar = [
  { title: "การันตีความพอใจ", desc: "เปลี่ยน/คืนเงินตามเงื่อนไข", icon: "shield", visible: true },
  { title: "การชำระเงินปลอดภัย", desc: "ปกป้องข้อมูลผู้ใช้เข้มงวด", icon: "lock", visible: true },
  { title: "ฝ่ายสนับสนุนฉับไว", desc: "ตอบกลับเร็ว ดูแลจนกว่าจะเสร็จสิ้น", icon: "clock", visible: true },
];

const defaultFooter = {
  title: "velounity",
  description: "A demonstration of modern authentication patterns and best practices",
  links: [
    { label: "Home", href: "/" },
    { label: "Premium", href: "/premium" },
    { label: "Authentication", href: "/auth" },
    { label: "Dashboard", href: "/dashboard" },
  ],
  visible: true,
};

export async function GET() {
  try {
    let content = await prisma.homePageContent.findFirst();

    if (!content) {
      content = await prisma.homePageContent.create({
        data: {
          sections: defaultSections as any,
          trustBar: defaultTrustBar as any,
          footer: defaultFooter as any,
          customSections: [] as any,
        },
      });
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error("Error fetching homepage content:", error);
    return NextResponse.json(
      { error: "Failed to fetch homepage content" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const adminCheck = await checkAdmin();
    if ("error" in adminCheck) {
      return NextResponse.json(
        { error: adminCheck.error },
        { status: adminCheck.status }
      );
    }

    const body = await request.json();
    const { sections, trustBar, footer, customSections } = body;

    let content = await prisma.homePageContent.findFirst();

    if (content) {
      content = await prisma.homePageContent.update({
        where: { id: content.id },
        data: {
          ...(sections !== undefined && { sections: sections as any }),
          ...(trustBar !== undefined && { trustBar: trustBar as any }),
          ...(footer !== undefined && { footer: footer as any }),
          ...(customSections !== undefined && { customSections: customSections as any }),
        },
      });
    } else {
      content = await prisma.homePageContent.create({
        data: {
          sections: sections || defaultSections as any,
          trustBar: trustBar || defaultTrustBar as any,
          footer: footer || defaultFooter as any,
          customSections: customSections || [] as any,
        },
      });
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error("Error updating homepage content:", error);
    return NextResponse.json(
      { error: "Failed to update homepage content" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const adminCheck = await checkAdmin();
    if ("error" in adminCheck) {
      return NextResponse.json(
        { error: adminCheck.error },
        { status: adminCheck.status }
      );
    }

    const content = await prisma.homePageContent.findFirst();
    if (content) {
      await prisma.homePageContent.update({
        where: { id: content.id },
        data: {
          sections: defaultSections as any,
          trustBar: defaultTrustBar as any,
          footer: defaultFooter as any,
          customSections: [] as any,
        },
      });
    }

    return NextResponse.json({ message: "Reset to defaults" });
  } catch (error) {
    console.error("Error resetting homepage content:", error);
    return NextResponse.json(
      { error: "Failed to reset homepage content" },
      { status: 500 }
    );
  }
}
