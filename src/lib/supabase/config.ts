/**
 * Membaca kunci Supabase dari .env.local.
 * Jika kunci belum diisi (masih kosong / masih contoh dari .env.example),
 * aplikasi berjalan dalam MODE DEMO memakai data contoh di src/lib/data/demo-seed.ts.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export function isSupabaseConfigured(): boolean {
  return !!SUPABASE_URL && !!SUPABASE_ANON_KEY && !SUPABASE_URL.includes('your-project-id') && !SUPABASE_ANON_KEY.includes('your-anon-key');
}
