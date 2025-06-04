import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    fullName: string;
    phoneNumber?: string;
    role: string;
    accessToken: string;
  }

  interface Session {
    user: User & DefaultSession["user"];
    accessToken: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
    accessToken?: string
  }

}
