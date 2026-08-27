import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const snapshot = await db.collection('appointments')
    .where('status', '==', 'APPROVED')
    .where('dateTime', '>=', new Date().toISOString())
    .where('dateTime', '<=', tomorrow.toISOString())
    .get();

  const notificationsSent = [];
  
  for (const doc of snapshot.docs) {
    const apt = doc.data();
    
    // Fetch pet
    const petDoc = await db.collection('pets').doc(apt.petId).get();
    if (petDoc.exists) {
      const pet = petDoc.data();
      
      // Fetch owner
      if (pet?.ownerId) {
        const ownerDoc = await db.collection('users').doc(pet.ownerId).get();
        if (ownerDoc.exists) {
          const owner = ownerDoc.data();
          notificationsSent.push(`[MOCK] Email sent to ${owner?.email}: Reminder for ${pet?.name}'s appointment on ${new Date(apt.dateTime).toLocaleString()}`);
        }
      }
    }
  }

  return NextResponse.json({
    message: 'Reminders processed successfully',
    notificationsSent,
  });
}
