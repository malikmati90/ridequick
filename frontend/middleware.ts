import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
 
export default NextAuth(authConfig).auth;
 
// export const config = {
//   // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
//   matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
// };


// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';  // Import the NextAuth JWT utility

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  console.log("TOOOOOOOOOOOOOOOOOKKKKKKKKKKKKEEEEEEEEENNNNNNNNN", token)
  
  // Check if the token exists (user is authenticated)
  if (token) {
    // Check if the user has access to the dashboard based on their role
    const isAdmin = token.role === 'admin';

    // Restrict access to the dashboard and protected pages if the user is not an admin
    if (req.nextUrl.pathname.startsWith('/dashboard') && !isAdmin) {
      return NextResponse.redirect(new URL('/403', req.url));  // Redirect to a 403 Forbidden page
    }
  } else {
    // If the user is not authenticated, redirect to login
    if (req.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // Continue with the request if no restrictions are hit
  return NextResponse.next();
}

// Apply middleware only to protected pages like '/dashboard'
export const config = {
  matcher: ['/dashboard', '/dashboard/*'], // Adjust the matcher to your needs
};
