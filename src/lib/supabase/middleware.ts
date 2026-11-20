import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from './config';

/** Halaman yang boleh dibuka tanpa login. */
const HALAMAN_PUBLIK = ['/login', '/register', '/forgot-password', '/reset-password'];

interface CookieToSet {
  name: string;
  value: string;
  options: CookieOptions;
}

/**
 * Memperbarui session Supabase Auth pada level Middleware Next.js.
 * Memastikan token autentikasi diperbarui dan me-redirect jika session tidak valid.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh auth session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isPublik = path === '/' || HALAMAN_PUBLIK.some((p) => path.startsWith(p));

  // Proteksi route internal jika user belum terautentikasi.
  // Pemeriksaan peran (hanya pengurus) dilakukan di AppShell + Row Level Security database.
  if (!user && !isPublik) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
