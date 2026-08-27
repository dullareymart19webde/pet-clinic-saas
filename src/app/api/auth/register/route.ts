import { NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebase-admin';

export async function POST(req: Request) {
  try {
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
      throw authError;
    }
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { 
        message: String(error)
      },
      { status: 500 }
    );
  }
}
