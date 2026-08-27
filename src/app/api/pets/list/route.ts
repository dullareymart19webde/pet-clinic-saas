import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const snapshot = await db.collection('pets').where('ownerId', '==', session.user.id).get();
  const pets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return NextResponse.json(pets);
}
