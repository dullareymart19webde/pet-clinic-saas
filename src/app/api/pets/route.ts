import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await req.json();
    const petRef = await db.collection('pets').add({
      ...data,
      ownerId: session.user.id,
      createdAt: new Date().toISOString(),
    });
    
    return NextResponse.json({ id: petRef.id, ...data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create pet' }, { status: 500 });
  }
}
