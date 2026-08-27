import admin from 'firebase-admin';

let db: admin.firestore.Firestore;
let auth: admin.auth.Auth;

try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
  db = admin.firestore();
  auth = admin.auth();
} catch (error) {
  console.error("Firebase Admin Initialization Error:", error);
  
  const throwError = () => { 
    throw new Error("Firebase Admin is not initialized. Please ensure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set in Vercel Environment Variables."); 
  };
  
  db = new Proxy({}, { get: throwError }) as any;
  auth = new Proxy({}, { get: throwError }) as any;
}

export { db, auth };
