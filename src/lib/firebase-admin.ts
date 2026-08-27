import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

let db: ReturnType<typeof getFirestore>;
let auth: ReturnType<typeof getAuth>;

try {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
  db = getFirestore();
  auth = getAuth();
} catch (error) {
  console.error("Firebase Admin Initialization Error:", error);
  
  // If Firebase fails to initialize, provide proxy objects that throw an error 
  // when used. This prevents Next.js API routes from crashing at the module 
  // level (which causes HTML 500 errors) and instead throws a catchable error 
  // inside the route handler, returning proper JSON.
  const throwError = () => { 
    throw new Error("Firebase Admin is not initialized. Please ensure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set in Vercel Environment Variables."); 
  };
  
  db = new Proxy({}, { get: throwError }) as any;
  auth = new Proxy({}, { get: throwError }) as any;
}

export { db, auth };
