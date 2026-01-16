import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CardHistoryClient from "./card-history-client";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "ประวัติการซื้อบัตรเติมเงิน",
};

async function getCardHistory() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            redirect("/");
        }

        // Query database directly instead of calling API
        const purchases = await prisma.purchaseCard.findMany({
            where: {
                userId: session.user.id,
            },
            include: {
                cardOption: {
                    include: {
                        card: true,
                    },
                },
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
        console.error("Error fetching card history:", error);
        return [];
    }
}

export default async function CardHistoryPage() {
    const purchases = await getCardHistory();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <CardHistoryClient purchases={purchases as any} />;
}
