import React from 'react';
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import { db } from '@/lib/db';

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    adapter: PrismaAdapter(db),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    session: { strategy: 'jwt' },
    callbacks: {
        async session({ token, session }) {
            if (token && session.user) session.user.id = token.sub!;
            return session;
        },
        async jwt({ token, user }) {
            if (user) token.sub = user.id;
            return token;
        },
    },
    events: {
        async createUser({ user }) {
            if (!user.email) return;
            const { sendEmail } = await import('@/lib/email');
            const { WelcomeEmail } = await import('@/emails');
            await sendEmail({
                to: user.email,
                subject: 'Bienvenido a CoreFoundry',
                react: React.createElement(WelcomeEmail, { userName: user.name ?? undefined }),
            });
        },
    },
    pages: { signIn: '/login' },
    secret: process.env.NEXTAUTH_SECRET,
});
