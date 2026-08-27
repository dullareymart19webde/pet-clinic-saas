import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await req.json();
    const aptRef = await db.collection('appointments').add({
      petId: data.petId,
      serviceId: data.serviceId,
      dateTime: data.dateTime,
      notes: data.notes,
      userId: session.user.id,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    });
    return NextResponse.json({ id: aptRef.id, ...data, userId: session.user.id, status: 'PENDING' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to book' }, { status: 500 });
  }
}
