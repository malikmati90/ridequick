import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { baseUrl, User } from '@/lib/definitions'
import jwt from 'jsonwebtoken';


async function fetchUserDetails(accessToken: string) {
    try {
      const res = await fetch(baseUrl + '/users/me', {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
  
      if (!res.ok) throw new Error("Failed to fetch user details");
  
      const userData = await res.json();
      return userData; // Expected to contain id, email, role, etc.
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
    }
  }
  

async function authenticate(email: string, password: string) {
    try {
        const res = await fetch(baseUrl + '/login/access-token', {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                username: email ?? "",
                password: password ?? "",
            }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Invalid credentials");

        // Decode the JWT token to get user ID
        const decoded = jwt.decode(data.access_token) as { sub?: string };
        const userId = decoded?.sub ?? "unknown";

        // Fetch user details including role
        const userDetails = await fetchUserDetails(data.access_token);
        if (!userDetails) throw new Error("User details not found");

        const user = {
            id: userDetails.id,
            email: userDetails.email,
            fullName: userDetails.fullName,
            phoneNumber: userDetails.phoneNumber,
            role: userDetails.role,
        } as User

        return user;

    } catch (error) {
        console.error("Login failed:", error);
        return null;
    }
}

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                // Parse credentials with Zod validation
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(8) })
                    .safeParse(credentials);

                if (!parsedCredentials.success) {
                    console.log('Invalid credentials');
                    return null;
                }

                const { email, password } = parsedCredentials.data;
                const user = await authenticate(email, password);

                if (!user) {
                    console.log('Invalid credentials');
                    return null;  // Return null if authentication fails
                }
                return user;
            },
        }),
    ],
    secret: process.env.AUTH_SECRET,
});