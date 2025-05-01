import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async authorized({ auth, request }) {
      const nextUrl = request.nextUrl;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isLoggedIn = !!auth?.user;
      const isAdmin = auth?.user?.role === 'admin';  // Ensure token exists before checking role
  
      if (isOnDashboard) {
        if (!isLoggedIn || !isAdmin) {
          // If not logged in or not admin, redirect to home page
          return Response.redirect(new URL('/', nextUrl));
        }
        return true; // Allow admin access to dashboard
      }
  
      return true; // Allow access to other pages
    },
    async session({ session, token }) {
      if (session.user) session.user.role = token.role as string
      return session;
    },
    async jwt({ token, user}) {
      if (user) token.role = user.role;
      return token;
    },
  },
  
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;