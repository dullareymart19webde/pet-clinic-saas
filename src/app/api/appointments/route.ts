import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await req.json();
    const apt = await prisma.appointment.create({
      data: {
        petId: data.petId,
        serviceId: data.serviceId,
        dateTime: data.dateTime,
        notes: data.notes,
        userId: session.user.id,
        status: 'PENDING'
      }
    });
    return NextResponse.json(apt, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to book' }, { status: 500 });
  }
}
