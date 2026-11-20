import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { isSupabaseConfigured } from '@/lib/supabase/config';

/**
 * Mode demo: selama kunci Supabase di .env.local masih kosong atau masih
 * contoh dari .env.example, pemeriksaan sesi dilewati supaya halaman admin bisa
 * dibuka dengan data contoh. Begitu kunci asli diisi, proteksi Supabase aktif.
 */
export async function middleware(request: NextRequest) {
  if (!isSupabaseConfigured()) return NextResponse.next();
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Cocokkan semua request path kecuali:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, docs, dll)
     */
    '/((?!_next/static|_next/image|favicon.ico|images|docs|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
