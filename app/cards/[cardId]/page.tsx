import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CardPurchaseClient from './card-purchase-client';

export const metadata: Metadata = {
  title: 'ซื้อบัตรเติมเงิน',
};

async function getCardData(cardId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/cards/${cardId}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching card data:', error);
    return null;
  }
}

export default async function CardPurchasePage({
  params,
}: {
  params: Promise<{ cardId: string }>;
}) {
  const { cardId } = await params;
  const data = await getCardData(cardId);

  if (!data || !data.card) {
    notFound();
  }

  return <CardPurchaseClient card={data.card} />;
}
