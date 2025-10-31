// lib/auth-options.ts
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET, // ✅ env var must be NEXTAUTH_SECRET

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/signin",
  },

  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider) token.provider = account.provider;
      return token;
    },

    async session({ session, token }) {
      if (token?.provider) (session as any).provider = token.provider;
      return session;
    },
  },
};