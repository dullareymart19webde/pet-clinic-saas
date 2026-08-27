import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { auth, db } from './firebase-admin';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'user@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // 1. Verify password with Firebase Auth REST API
          const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
          if (!apiKey) {
            console.error('CRITICAL ERROR: NEXT_PUBLIC_FIREBASE_API_KEY is missing in environment variables. NextAuth cannot verify the user password.');
            throw new Error('Missing NEXT_PUBLIC_FIREBASE_API_KEY');
          }
          const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
              returnSecureToken: true,
            }),
          });

          const data = await res.json();
          if (!res.ok) {
            console.error('Firebase Auth error:', data.error);
            return null;
          }

          // 2. Fetch additional user data from Firestore (if exists)
          const uid = data.localId;
          const userRecord = await auth.getUser(uid);
          
          let role = 'ADMIN';
          let name = userRecord.displayName || 'Admin';

          // Try to get more details from Firestore if we have a users collection
          try {
            const userDoc = await db.collection('users').doc(uid).get();
            if (userDoc.exists) {
              const userData = userDoc.data();
              if (userData?.role) role = userData.role;
              if (userData?.firstName && userData?.lastName) name = `${userData.firstName} ${userData.lastName}`;
            }
          } catch (dbErr) {
            console.error('Error fetching user from Firestore:', dbErr);
          }

          return {
            id: uid,
            email: data.email,
            name,
            role: role as any,
          };
        } catch (error) {
          console.error('Error during authorization:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as any;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET || "super-secret-key-for-next-auth-pet-clinic-123!",
  debug: true,
};
