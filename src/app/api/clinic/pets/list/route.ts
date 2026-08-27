import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role === 'PET_OWNER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const petsSnapshot = await db.collection('pets').orderBy('name', 'asc').get();
  const pets = [];
  
  for (const doc of petsSnapshot.docs) {
    const pet: any = { id: doc.id, ...doc.data() };
    if (pet.ownerId) {
      const ownerDoc = await db.collection('users').doc(pet.ownerId).get();
      if (ownerDoc.exists) {
        pet.owner = { id: ownerDoc.id, ...ownerDoc.data() };
      }
    }
    pets.push(pet);
  }

  return NextResponse.json(pets);
}
