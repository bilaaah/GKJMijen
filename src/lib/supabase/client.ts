import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database.types';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from './config';

const buat = () => createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
let cached: ReturnType<typeof buat> | null = null;

/**
 * Supabase Client untuk Client Components di browser.
 * Selalu memakai token pengguna yang sedang login, sehingga Row Level Security
 * di database tetap berlaku. Satu instance dipakai bersama di seluruh halaman.
 */
export function createClient() {
  if (!cached) cached = buat();
  return cached;
}
