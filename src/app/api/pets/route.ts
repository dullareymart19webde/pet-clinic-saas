import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await req.json();
    const pet = await prisma.pet.create({
      data: {
        ...data,
        ownerId: session.user.id,
      },
    });
    return NextResponse.json(pet, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create pet' }, { status: 500 });
  }
}
