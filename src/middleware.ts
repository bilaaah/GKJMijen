import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

/**
 * Mode frontend: selama kunci Supabase di .env.local masih kosong atau masih
 * contoh dari .env.example, pemeriksaan sesi dilewati supaya halaman admin bisa
 * dibuka dengan data contoh. Begitu kunci asli diisi, proteksi Supabase aktif lagi.
 */
function supabaseBelumDiatur(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
  return !url || !key || url.includes('your-project-id') || key.includes('your-anon-key');
}

export async function middleware(request: NextRequest) {
  if (supabaseBelumDiatur()) return NextResponse.next();
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
     * - api/siaran (daftar siaran YouTube untuk landing page publik)
     */
    '/((?!_next/static|_next/image|favicon.ico|images|docs|api/siaran|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
