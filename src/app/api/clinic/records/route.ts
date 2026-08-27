import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role === 'PET_OWNER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    const recordRef = await db.collection('medical_records').add({
      ...data,
      vetId: session.user.id,
      createdAt: new Date().toISOString(),
    });
    return NextResponse.json({ id: recordRef.id, ...data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create record' }, { status: 500 });
  }
}
