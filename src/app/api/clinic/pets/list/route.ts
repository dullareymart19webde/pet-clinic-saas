import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role === 'PET_OWNER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const pets = await prisma.pet.findMany({ 
    include: { owner: true },
    orderBy: { name: 'asc' } 
  });
  return NextResponse.json(pets);
}
