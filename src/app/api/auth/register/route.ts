import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    let auth, db;
    try {
      const admin = await import('@/lib/firebase-admin');
      auth = admin.auth;
      db = admin.db;
    } catch (importError: any) {
      return NextResponse.json(
        { message: 'Firebase Import Error: ' + (importError?.message || String(importError)) },
        { status: 400 }
      );
    }

    const { email, password, firstName, lastName, role } = await req.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    try {
      // Create user in Firebase Auth
      const userRecord = await auth.createUser({
        email,
        password,
        displayName: `${firstName} ${lastName}`,
      });

      // Save additional user info in Firestore
      await db.collection('users').doc(userRecord.uid).set({
        email,
        firstName,
        lastName,
        role: role || 'PET_OWNER',
        createdAt: new Date().toISOString(),
      });

      return NextResponse.json(
        { message: 'User created successfully', user: { id: userRecord.uid, email: userRecord.email } },
        { status: 201 }
      );
    } catch (authError: any) {
      if (authError.code === 'auth/email-already-exists') {
        return NextResponse.json(
          { message: 'User already exists' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { message: 'Firebase Auth/DB Error: ' + (authError?.message || String(authError)) },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { 
        message: 'Outer Error: ' + (error?.message || String(error))
      },
      { status: 400 }
    );
  }
}
