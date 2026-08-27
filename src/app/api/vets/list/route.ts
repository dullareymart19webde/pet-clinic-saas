import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const vetsSnapshot = await db.collection('users').where('role', '==', 'VET').get();
    
    if (vetsSnapshot.empty) {
      return NextResponse.json([]);
    }

    const vets = vetsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: `Dr. ${data.firstName} ${data.lastName}`,
        email: data.email,
        specialty: data.specialty || 'General Practice',
      };
    });

    return NextResponse.json(vets);
  } catch (error) {
    console.error('Error fetching vets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch veterinarians' },
      { status: 500 }
    );
  }
}
