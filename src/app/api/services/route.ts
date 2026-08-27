import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET() {
  const snapshot = await db.collection('services').orderBy('name', 'asc').get();
  const services = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
  return NextResponse.json(services);
}
