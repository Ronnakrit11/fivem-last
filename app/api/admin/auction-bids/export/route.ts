import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user || (user.role !== "admin" && user.role !== "owner")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const auctionItems = await prisma.gameItem.findMany({
      where: { isAuction: true },
      include: {
        auctionBids: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: { amount: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const statusMap: Record<string, string> = {
      PENDING: "รอผล",
      WON: "ชนะ - รอชำระเงิน",
      PAID: "แนบสลิปแล้ว",
      COMPLETED: "เสร็จสิ้น",
      LOST: "ไม่ชนะ",
    };

    const headers = [
      "สินค้าประมูล",
      "วันจบประมูล",
      "ชื่อผู้ประมูล",
      "อีเมล",
      "ราคาประมูล",
      "สถานะ",
      "ลำดับ",
      "วันที่ประมูล",
      "มีสลิป User",
      "มีสลิปแอดมิน",
      "มีไฟล์ดาวน์โหลด",
    ];

    const rows: string[][] = [];

    for (const item of auctionItems) {
      const endDate = item.auctionEndDate
        ? new Date(item.auctionEndDate).toLocaleString("th-TH", { timeZone: "Asia/Bangkok" })
        : "-";

      for (let i = 0; i < item.auctionBids.length; i++) {
        const bid = item.auctionBids[i];
        const bidDate = new Date(bid.createdAt).toLocaleString("th-TH", { timeZone: "Asia/Bangkok" });

        rows.push([
          item.name,
          endDate,
          bid.user?.name || "-",
          bid.user?.email || "-",
          bid.amount.toFixed(2),
          statusMap[bid.status] || bid.status,
          `${i + 1}`,
          bidDate,
          bid.slipImage ? "มี" : "ไม่มี",
          bid.adminSlipImage ? "มี" : "ไม่มี",
          bid.downloadFile ? "มี" : "ไม่มี",
        ]);
      }

      if (item.auctionBids.length === 0) {
        rows.push([
          item.name,
          endDate,
          "-",
          "-",
          "-",
          "-",
          "-",
          "-",
          "-",
          "-",
          "-",
        ]);
      }
    }

    const escapeCsv = (val: string) => {
      if (val.includes(",") || val.includes('"') || val.includes("\n")) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    };

    const csvContent =
      "\uFEFF" +
      headers.map(escapeCsv).join(",") +
      "\n" +
      rows.map((row) => row.map(escapeCsv).join(",")).join("\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="auction-bids-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    console.error("Error exporting auction bids:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
