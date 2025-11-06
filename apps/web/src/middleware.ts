import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes and their required roles
const protectedRoutes = {
  '/customer': ['CUSTOMER'],
  '/contractor': ['CONTRACTOR'],
  '/admin': ['ADMIN'],
  '/coordinator': ['COORDINATOR'],
  '/sales': ['SALES'],
};

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/services',
  '/contractors',
  '/products',
  '/about',
  '/contact',
  '/magic-link',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is public
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check if the route is protected
  const protectedRoute = Object.keys(protectedRoutes).find((route) =>
    pathname.startsWith(route)
  );

  if (protectedRoute) {
    // In a real application, you would verify the JWT token here
    // For now, we'll just check if there's a token in the request
    const token = request.cookies.get('accessToken')?.value;

    if (!token) {
      // Redirect to login if no token
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // In a production app, you would:
    // 1. Verify the JWT token
    // 2. Extract user role from the token
    // 3. Check if the user has the required role for the route
    // 4. Redirect to unauthorized page if role doesn't match
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
