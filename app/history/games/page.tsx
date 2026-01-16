import { Metadata } from "next";
import GameHistoryClient from "./game-history-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "ประวัติการเติมเกม",
};

async function getGameHistory() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            redirect("/");
        }

        // Query database directly instead of calling API
        const purchases = await prisma.purchaseGame.findMany({
            where: {
                userId: session.user.id,
            },
            include: {
                package: {
                    include: {
                        game: true,
                    },
                },
                mixPackage: {
                    include: {
                        game: true,
                    },
                },
                server: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        // Convert Decimal to number for client component
        return purchases.map((purchase) => ({
            ...purchase,
            paid: Number(purchase.paid),
            beforeBalance: Number(purchase.beforeBalance),
            afterBalance: Number(purchase.afterBalance),
        }));
    } catch (error) {
        console.error("Error fetching game history:", error);
        return [];
    }
}

export default async function GameHistoryPage() {
    const purchases = await getGameHistory();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <GameHistoryClient purchases={purchases as any} />;
}
