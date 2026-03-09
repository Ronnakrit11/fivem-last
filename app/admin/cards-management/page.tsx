import { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import CardsManagementClient from './cards-management-client';

export const metadata: Metadata = {
  title: 'จัดการบัตรเติมเงิน | Admin',
};

async function checkAdminAndGetCards() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/');
  }

  // Check if user is admin from database
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== 'admin' && user?.role !== 'owner') {
    redirect('/');
  }

  // Fetch cards directly from database instead of calling API
  try {
    const cards = await prisma.card.findMany({
      orderBy: { sort: 'asc' },
      include: {
        cardOptions: {
          orderBy: { sort: 'asc' },
        },
      },
    });

    return cards;
  } catch (error) {
    console.error('[Cards Management] Error fetching cards from database:', error);
    return [];
  }
}

export default async function CardsManagementPage() {
  const cards = await checkAdminAndGetCards();

  return <CardsManagementClient initialCards={cards} />;
}
