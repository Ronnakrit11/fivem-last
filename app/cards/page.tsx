import { Metadata } from 'next';
import CardsClient from './cards-client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'บัตรเติมเงิน | ซื้อบัตรเติมเงินออนไลน์',
  description: 'ซื้อบัตรเติมเงินออนไลน์ รวดเร็ว ปลอดภัย รองรับทุกเครือข่าย',
};

async function getCards() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/cards`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data.cards || [];
  } catch (error) {
    console.error('Error fetching cards:', error);
    return [];
  }
}

export default async function CardsPage() {
  const cards = await getCards();

  return <CardsClient cards={cards} />;
}
