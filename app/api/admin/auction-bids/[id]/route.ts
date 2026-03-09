import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// DELETE - Delete auction bid (owner only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    if (!user || user.role !== "owner") {
      return NextResponse.json({ error: "Forbidden - Owner only" }, { status: 403 });
    }

    // Check if bid exists
    const bid = await prisma.auctionBid.findUnique({
      where: { id },
    });

    if (!bid) {
      return NextResponse.json({ error: "Bid not found" }, { status: 404 });
    }

    await prisma.auctionBid.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "ลบรายการประมูลสำเร็จ" });
  } catch (error) {
    console.error("Error deleting auction bid:", error);
    return NextResponse.json({ error: "Failed to delete auction bid" }, { status: 500 });
  }
}

// PATCH - Update auction bid status (admin only)
export async function PATCH(
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

    if (!user || (user.role !== "admin" && user.role !== "owner")) {
      return NextResponse.json(
        { error: "Forbidden - Admin only" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status, adminSlipImage, downloadFile } = body;

    if (!status || !["PENDING", "WON", "LOST", "PAID", "COMPLETED"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // Get the bid
    const bid = await prisma.auctionBid.findUnique({
      where: { id },
      include: { gameItem: true },
    });

    if (!bid) {
      return NextResponse.json(
        { error: "Bid not found" },
        { status: 404 }
      );
    }

    // If setting as WON, set all other bids for this item as LOST
    if (status === "WON") {
      await prisma.$transaction([
        // Set all other bids as LOST
        prisma.auctionBid.updateMany({
          where: {
            gameItemId: bid.gameItemId,
            id: { not: id },
          },
          data: { status: "LOST" },
        }),
        // Set this bid as WON
        prisma.auctionBid.update({
          where: { id },
          data: {
            status: "WON",
            adminSlipImage: adminSlipImage || null,
          },
        }),
        // Deactivate the auction item
        prisma.gameItem.update({
          where: { id: bid.gameItemId },
          data: { isActive: false },
        }),
      ]);
    } else if (status === "PAID") {
      // Admin uploads slip on behalf of user (marking as paid)
      await prisma.auctionBid.update({
        where: { id },
        data: {
          status: "PAID",
          adminSlipImage: adminSlipImage || bid.adminSlipImage,
        },
      });
    } else if (status === "COMPLETED") {
      // Admin confirms payment and attaches download file
      await prisma.auctionBid.update({
        where: { id },
        data: {
          status: "COMPLETED",
          downloadFile: downloadFile || null,
          adminSlipImage: adminSlipImage || bid.adminSlipImage,
        },
      });
    } else {
      await prisma.auctionBid.update({
        where: { id },
        data: { status },
      });
    }

    const updatedBid = await prisma.auctionBid.findUnique({
      where: { id },
      include: {
        gameItem: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      bid: updatedBid,
      message: status === "WON" ? "อนุมัติผู้ชนะประมูลสำเร็จ" : 
               status === "COMPLETED" ? "ยืนยันการชำระเงินสำเร็จ" :
               "อัปเดตสถานะสำเร็จ",
    });
  } catch (error) {
    console.error("Error updating auction bid:", error);
    return NextResponse.json(
      { error: "Failed to update auction bid" },
      { status: 500 }
    );
  }
}
