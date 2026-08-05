import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Definicja publicznych ścieżek
const PUBLIC_ROUTES = ['/', '/login', '/register', '/api/webhooks'];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  const isPublicRoute = PUBLIC_ROUTES.some((route) => 
    request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(route + '/')
  );

  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard');

  // 1. Jeśli użytkownik próbuje wejść na dashboard, a nie ma sesji -> /login
  if (isDashboardRoute && !session && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    // Zachowaj url powrotny, aby po zalogowaniu wrócić tam, gdzie był
    url.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // 2. Jeśli użytkownik jest zalogowany i próbuje wejść na login/register -> /dashboard
  if (!isPublicRoute && session && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};