import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
// import { User } from "@/lib/definitions";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    fullName: string;
    phoneNumber?: string;
    role: string;
  }

  interface Session {
    user: User & DefaultSession["user"];
  }

  interface JWT {
    role: string
  }

}
