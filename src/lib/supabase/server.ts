import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database.types';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from './config';

interface CookieToSet {
  name: string;
  value: string;
  options: CookieOptions;
}

/**
 * Membuat instance Supabase Client untuk Server Components, Server Actions,
 * dan Route Handlers. Mengelola session berbasis cookie HTTP-only secara aman.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Dipanggil dari Server Component; penulisan cookie diabaikan jika telah dikirim.
          }
        },
      },
    }
  );
}

/**
 * Membuat instance Supabase Admin Client menggunakan Service Role Key.
 * PERHATIAN: Hanya untuk operasi backend internal / background tasks yang
 * membutuhkan bypass Row Level Security (RLS). JANGAN diekspos ke client!
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY belum dikonfigurasi pada environment variable.');
  }

  return createServerClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    cookies: {
      getAll: () => [],
      setAll: () => {},
    },
  });
}
