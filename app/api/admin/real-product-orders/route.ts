import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET - List all real product orders (admin)
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user || (user.role !== "admin" && user.role !== "owner")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.realProductOrder.findMany({
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: {
            include: { realProduct: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.realProductOrder.count(),
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching real product orders:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Delete a real product order
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user || (user.role !== "admin" && user.role !== "owner")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("id");

    if (!orderId) {
      return NextResponse.json({ error: "Missing order id" }, { status: 400 });
    }

    const order = await prisma.realProductOrder.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // If order is PENDING, restore stock before deleting
    if (order.status === "PENDING") {
      await prisma.$transaction(async (tx) => {
        for (const item of order.items) {
          await tx.realProduct.update({
            where: { id: item.realProductId },
            data: { stock: { increment: item.quantity } },
          });
        }
        await tx.realProductOrderItem.deleteMany({ where: { orderId } });
        await tx.realProductOrder.delete({ where: { id: orderId } });
      });
    } else {
      await prisma.$transaction(async (tx) => {
        await tx.realProductOrderItem.deleteMany({ where: { orderId } });
        await tx.realProductOrder.delete({ where: { id: orderId } });
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting real product order:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH - Update order status (approve/reject)
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user || (user.role !== "admin" && user.role !== "owner")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { orderId, status, adminNote } = body;

    if (!orderId || !status) {
      return NextResponse.json({ error: "Missing orderId or status" }, { status: 400 });
    }

    const validStatuses = ["PENDING", "APPROVED", "REJECTED", "COMPLETED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // If rejecting, restore stock
    if (status === "REJECTED") {
      const order = await prisma.realProductOrder.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      if (order && order.status === "PENDING") {
        await prisma.$transaction(async (tx) => {
          // Restore stock
          for (const item of order.items) {
            await tx.realProduct.update({
              where: { id: item.realProductId },
              data: { stock: { increment: item.quantity } },
            });
          }

          // Update order status
          await tx.realProductOrder.update({
            where: { id: orderId },
            data: { status, adminNote: adminNote || null },
          });
        });

        return NextResponse.json({ success: true });
      }
    }

    const updatedOrder = await prisma.realProductOrder.update({
      where: { id: orderId },
      data: { status, adminNote: adminNote || null },
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Error updating real product order:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
