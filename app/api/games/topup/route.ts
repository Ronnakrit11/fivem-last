import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getWepayAPI } from "@/lib/wepay";
import { Decimal } from "@prisma/client/runtime/library";

// POST /api/games/topup - เติมเกม
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
        const { gameId, playerId, serverId, packageId, mixPackageId } = body;

        // Validation: ต้องเลือก package หรือ mixPackage เพียงอย่างเดียว
        if ((!packageId && !mixPackageId) || (packageId && mixPackageId)) {
            return NextResponse.json(
                { error: "กรุณาเลือก package หรือ mixPackage เพียงอย่างเดียว" },
                { status: 400 }
            );
        }

        // ดึงข้อมูลเกม
        const game = await prisma.game.findUnique({
            where: { id: gameId },
        });

        if (!game || !game.isActive) {
            return NextResponse.json(
                { error: "ไม่พบเกมหรือเกมไม่เปิดใช้งาน" },
                { status: 404 }
            );
        }

        // ตรวจสอบ playerId
        if (game.isPlayerId && !playerId) {
            return NextResponse.json(
                { error: `กรุณากรอก ${game.playerFieldName}` },
                { status: 400 }
            );
        }

        // ตรวจสอบ server
        if (game.isServer && !serverId) {
            return NextResponse.json(
                { error: "กรุณาเลือก Server" },
                { status: 400 }
            );
        }

        let server = null;
        if (serverId) {
            server = await prisma.server.findFirst({
                where: {
                    id: serverId,
                    gameId: gameId,
                    isActive: true,
                },
            });

            if (!server) {
                return NextResponse.json(
                    {
                        error: "ไม่พบ Server หรือ Server ไม่เปิดใช้งาน หรือ Server ไม่ได้อยู่ในเกมนี้",
                    },
                    { status: 404 }
                );
            }
        }

        // ดึงข้อมูล package
        let selectedPackage = null;
        let selectedMixPackage = null;
        let price = new Decimal(0);
        let packageName = "";

        if (packageId) {
            selectedPackage = await prisma.package.findUnique({
                where: { id: packageId },
                include: { game: true },
            });

            if (
                !selectedPackage ||
                !selectedPackage.isActive ||
                selectedPackage.gameId !== gameId
            ) {
                return NextResponse.json(
                    { error: "ไม่พบ Package หรือ Package ไม่เปิดใช้งาน" },
                    { status: 404 }
                );
            }

            price = selectedPackage.price;
            packageName = selectedPackage.name;
        } else if (mixPackageId) {
            selectedMixPackage = await prisma.mixPackage.findUnique({
                where: { id: mixPackageId },
                include: { game: true },
            });

            if (
                !selectedMixPackage ||
                !selectedMixPackage.isActive ||
                selectedMixPackage.gameId !== gameId
            ) {
                return NextResponse.json(
                    {
                        error: "ไม่พบ Mix Package หรือ Mix Package ไม่เปิดใช้งาน",
                    },
                    { status: 404 }
                );
            }

            price = selectedMixPackage.price;
            packageName = selectedMixPackage.name;
        }

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

        // สร้าง PurchaseGame
        const purchase = await prisma.purchaseGame.create({
            data: {
                userId: user.id,
                playerId: playerId || null,
                serverId: serverId || null,
                packageId: packageId || null,
                mixPackageId: mixPackageId || null,
                paid: price,
                beforeBalance: beforeBalance,
                afterBalance: afterBalance,
                status: "PENDING",
            },
        });

        // เตรียมข้อมูลสำหรับส่งไปยัง Wepay
        try {
            const wepayAPI = getWepayAPI();

            // สร้าง reference ที่ถูกต้องตามรูปแบบ Wepay (a-z, A-Z, 0-9, ไม่เกิน 20 ตัว)
            const cleanReference = purchase.id
                .replace(/-/g, "")
                .substring(0, 20);

            // สำหรับ mixPackage ต้อง loop ส่ง
            if (selectedMixPackage && selectedMixPackage.items) {
                const items = selectedMixPackage.items as string[];

                // ส่งแต่ละ package ใน mixPackage
                for (let i = 0; i < items.length; i++) {
                    const itemId = items[i];
                    const pkg = await prisma.package.findUnique({
                        where: { id: itemId },
                    });

                    if (pkg && pkg.packageCode) {
                        // สร้าง reference สำหรับแต่ละ item (เพิ่ม index เพื่อไม่ให้ซ้ำ)
                        const itemReference = `${cleanReference.substring(
                            0,
                            18
                        )}${String(i + 1).padStart(2, "0")}`;
                        await wepayAPI.topupGame({
                            amount: Number(pkg.packageCode),
                            uid: playerId || "0000000000",
                            ...(game.isServer && server?.serverCode
                                ? { server: server.serverCode }
                                : {}),
                            company: pkg.gameCode as string,
                            reference: itemReference,
                        });
                    }
                }
            } else if (selectedPackage && selectedPackage.packageCode) {
                // ส่ง package เดียว
                const result = await wepayAPI.topupGame({
                    amount: Number(selectedPackage.packageCode),
                    uid: playerId || "0000000000",
                    ...(game.isServer && server?.serverCode
                        ? { server: server.serverCode }
                        : {}),
                    company: selectedPackage.gameCode as string,
                    reference: cleanReference,
                });

                console.log("result single: ", result);

                // อัพเดท transaction ID
                if (result.transaction_id) {
                    await prisma.purchaseGame.update({
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

            await prisma.purchaseGame.update({
                where: { id: purchase.id },
                data: {
                    status: "FAILED",
                    content: "เกิดข้อผิดพลาดในการเชื่อมต่อ Wepay API",
                },
            });

            return NextResponse.json(
                { error: "ข้อมูลผู้เล่นผิด กรุณาตรวจสอบอีกครั้ง" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "รับรายการเติมเกมสำเร็จ กรุณารอสักครู่",
                purchase: {
                    id: purchase.id,
                    packageName,
                    price: Number(price),
                    status: purchase.status,
                },
                newBalance: Number(afterBalance),
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error processing game topup:", error);
        return NextResponse.json(
            { error: "เกิดข้อผิดพลาดในการทำรายการ" },
            { status: 500 }
        );
    }
}
