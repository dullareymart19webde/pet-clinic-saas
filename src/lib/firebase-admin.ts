import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

try {
  if (!getApps().length) {
    // Check if env vars are provided
    if (!process.env.FIREBASE_PROJECT_ID) {
      console.warn("WARNING: FIREBASE_PROJECT_ID is missing. Firebase Admin may not initialize correctly.");
    }
    
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
} catch (error) {
  console.error("Firebase Admin Initialization Error:", error);
}

const db = getFirestore();
const auth = getAuth();

export { db, auth };
