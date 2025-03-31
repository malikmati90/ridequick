import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      console.log("LLOOOOOOOOOOOOOGGG: ", isLoggedIn)
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      console.log("LLOOOOOOOOOOOOOGGG: ", isOnDashboard)

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  // async jwt({ token, user }) {
  //   if (user) token.role = user.role;
  //   return token;
  // },
  // async session({ session, token }) {
  //   if (session?.user) session.user.role = token.role;
  //   return session;
  // },
  
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;