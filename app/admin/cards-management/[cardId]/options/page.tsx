import { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import CardOptionsManagementClient from './card-options-management-client';

export const metadata: Metadata = {
  title: 'จัดการ Card Options | Admin',
};

async function getCardWithOptions(cardId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      redirect('/');
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/admin/cards/${cardId}`, {
      cache: 'no-store',
      headers: {
        Cookie: (await headers()).get('cookie') || '',
      },
    });

    if (res.status === 403 || res.status === 401) {
      redirect('/');
    }

    if (!res.ok) {
      redirect('/admin/cards-management');
    }

    const data = await res.json();
    return data.card;
  } catch (error) {
    console.error('Error fetching card:', error);
    redirect('/admin/cards-management');
  }
}

export default async function CardOptionsManagementPage({
  params,
}: {
  params: Promise<{ cardId: string }>;
}) {
  const { cardId } = await params;
  const card = await getCardWithOptions(cardId);

  return <CardOptionsManagementClient initialCard={card} />;
}
