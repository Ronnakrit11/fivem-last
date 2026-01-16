import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// GET - ดึงการตั้งค่าปัจจุบัน
export async function GET(request: NextRequest) {
  try {
    // ดึงข้อมูลการตั้งค่า (ถ้าไม่มีก็สร้างใหม่)
    let settings = await prisma.websiteSettings.findFirst();
    
    if (!settings) {
      settings = await prisma.websiteSettings.create({
        data: {
          navbarColor: "rgba(15, 23, 42, 0.7)",
          backgroundColor: "#0a0e1a",
          bottomNavColor: "rgba(15, 23, 42, 0.7)",
          homeButtonBgColor: "rgba(255, 255, 255, 0.1)",
          homeButtonTextColor: "#d1d5db",
          homeButtonActiveBg: "rgba(255, 255, 255, 0.1)",
          homeButtonActiveText: "#a78bfa",
          bottomNavIconColor: "#d1d5db",
          bottomNavTextColor: "#d1d5db",
          bottomNavActiveIcon: "#fbbf24",
          bottomNavActiveText: "#fbbf24",
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching website settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch website settings" },
      { status: 500 }
    );
  }
}

// PUT - อัพเดทการตั้งค่า (Admin only)
export async function PUT(request: NextRequest) {
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

    // ตรวจสอบว่าเป็น admin หรือไม่
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
    const { 
      navbarColor, 
      backgroundColor, 
      bottomNavColor,
      homeButtonBgColor,
      homeButtonTextColor,
      homeButtonActiveBg,
      homeButtonActiveText,
      bottomNavIconColor,
      bottomNavTextColor,
      bottomNavActiveIcon,
      bottomNavActiveText
    } = body;

    // ดึงการตั้งค่าปัจจุบัน
    let settings = await prisma.websiteSettings.findFirst();

    if (!settings) {
      // สร้างใหม่ถ้ายังไม่มี
      settings = await prisma.websiteSettings.create({
        data: {
          navbarColor: navbarColor || "rgba(15, 23, 42, 0.7)",
          backgroundColor: backgroundColor || "#0a0e1a",
          bottomNavColor: bottomNavColor || "rgba(15, 23, 42, 0.7)",
          homeButtonBgColor: homeButtonBgColor || "rgba(255, 255, 255, 0.1)",
          homeButtonTextColor: homeButtonTextColor || "#d1d5db",
          homeButtonActiveBg: homeButtonActiveBg || "rgba(255, 255, 255, 0.1)",
          homeButtonActiveText: homeButtonActiveText || "#a78bfa",
          bottomNavIconColor: bottomNavIconColor || "#d1d5db",
          bottomNavTextColor: bottomNavTextColor || "#d1d5db",
          bottomNavActiveIcon: bottomNavActiveIcon || "#fbbf24",
          bottomNavActiveText: bottomNavActiveText || "#fbbf24",
        },
      });
    } else {
      // อัพเดทถ้ามีอยู่แล้ว
      settings = await prisma.websiteSettings.update({
        where: { id: settings.id },
        data: {
          navbarColor: navbarColor !== undefined ? navbarColor : settings.navbarColor,
          backgroundColor: backgroundColor !== undefined ? backgroundColor : settings.backgroundColor,
          bottomNavColor: bottomNavColor !== undefined ? bottomNavColor : settings.bottomNavColor,
          homeButtonBgColor: homeButtonBgColor !== undefined ? homeButtonBgColor : settings.homeButtonBgColor,
          homeButtonTextColor: homeButtonTextColor !== undefined ? homeButtonTextColor : settings.homeButtonTextColor,
          homeButtonActiveBg: homeButtonActiveBg !== undefined ? homeButtonActiveBg : settings.homeButtonActiveBg,
          homeButtonActiveText: homeButtonActiveText !== undefined ? homeButtonActiveText : settings.homeButtonActiveText,
          bottomNavIconColor: bottomNavIconColor !== undefined ? bottomNavIconColor : settings.bottomNavIconColor,
          bottomNavTextColor: bottomNavTextColor !== undefined ? bottomNavTextColor : settings.bottomNavTextColor,
          bottomNavActiveIcon: bottomNavActiveIcon !== undefined ? bottomNavActiveIcon : settings.bottomNavActiveIcon,
          bottomNavActiveText: bottomNavActiveText !== undefined ? bottomNavActiveText : settings.bottomNavActiveText,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating website settings:", error);
    return NextResponse.json(
      { error: "Failed to update website settings" },
      { status: 500 }
    );
  }
}
