import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth-options";

export const runtime = "nodejs";

export const {
  handlers: { GET, POST },
} = NextAuth(authOptions);