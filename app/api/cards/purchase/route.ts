import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getWepayAPI } from "@/lib/wepay";
import { Decimal } from "@prisma/client/runtime/library";

// POST /api/cards/purchase - ซื้อบัตรเติมเงิน
export async function POST(request: NextRequest) {
    try {
        // ตรวจสอบการ login
        const session = await auth.api.getSession({
            headers: request.headers,
        });

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { cardId, cardOptionId, amount } = body;

        if (!cardOptionId) {
            return NextResponse.json(
                { error: "กรุณาเลือก CardOption" },
                { status: 400 }
            );
        }

        // ดึงข้อมูล card
        const card = await prisma.card.findUnique({
            where: { id: cardId },
        });

        if (!card || !card.isActive) {
            return NextResponse.json(
                { error: "ไม่พบบัตรเติมเงินหรือบัตรไม่เปิดใช้งาน" },
                { status: 404 }
            );
        }

        // ดึงข้อมูล CardOption
        const cardOption = await prisma.cardOption.findUnique({
            where: { id: cardOptionId },
            include: { card: true },
        });

        if (
            !cardOption ||
            !cardOption.isActive ||
            cardOption.cardId !== cardId
        ) {
            return NextResponse.json(
                { error: "ไม่พบ CardOption หรือ CardOption ไม่เปิดใช้งาน" },
                { status: 404 }
            );
        }

        const price = cardOption.price;
        const cardName = cardOption.name;

        // ดึงข้อมูล user และตรวจสอบยอดเงิน
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        if (!user) {
            return NextResponse.json(
                { error: "ไม่พบข้อมูลผู้ใช้" },
                { status: 404 }
            );
        }

        if (user.balance < Number(price)) {
            return NextResponse.json(
                { error: "ยอดเงินไม่เพียงพอ" },
                { status: 400 }
            );
        }

        // หักเงิน
        const beforeBalance = new Decimal(user.balance);
        const afterBalance = beforeBalance.sub(price);

        await prisma.user.update({
            where: { id: user.id },
            data: { balance: Number(afterBalance) },
        });

        // สร้าง PurchaseCard
        const purchase = await prisma.purchaseCard.create({
            data: {
                userId: user.id,
                cardOptionId: cardOptionId,
                amount: amount || 1,
                paid: price,
                beforeBalance: beforeBalance,
                afterBalance: afterBalance,
                status: "PENDING",
            },
        });

        // ส่งไปยัง Wepay
        try {
            const wepayAPI = getWepayAPI();

            // สร้าง reference ที่ถูกต้องตามรูปแบบ Wepay (a-z, A-Z, 0-9, ไม่เกิน 20 ตัว)
            const cleanReference = purchase.id
                .replace(/-/g, "")
                .substring(0, 20);

            if (cardOption.gameCode) {
                const result = await wepayAPI.buyCashCard({
                    amount: Number(cardOption.packageCode),
                    company: cardOption.gameCode,
                    reference: cleanReference,
                });

                // อัพเดท transaction ID
                if (result.transaction_id) {
                    await prisma.purchaseCard.update({
                        where: { id: purchase.id },
                        data: { wepayTxnId: String(result.transaction_id) },
                    });
                }
            }
        } catch (wepayError) {
            console.error("Wepay API Error:", wepayError);

            // คืนเงินให้ผู้ใช้
            await prisma.user.update({
                where: { id: user.id },
                data: { balance: Number(beforeBalance) },
            });

            await prisma.purchaseCard.update({
                where: { id: purchase.id },
                data: {
                    status: "FAILED",
                    content: "เกิดข้อผิดพลาดในการเชื่อมต่อ Wepay API",
                },
            });

            return NextResponse.json(
                {
                    error: "เกิดข้อผิดพลาดในการซื้อบัตรเติมเงิน กรุณาลองใหม่อีกครั้ง",
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "รับรายการซื้อบัตรเติมเงินสำเร็จ กรุณารอสักครู่",
                purchase: {
                    id: purchase.id,
                    cardName,
                    price: Number(price),
                    status: purchase.status,
                },
                newBalance: Number(afterBalance),
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error processing card purchase:", error);
        return NextResponse.json(
            { error: "เกิดข้อผิดพลาดในการทำรายการ" },
            { status: 500 }
        );
    }
}
