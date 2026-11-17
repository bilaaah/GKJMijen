import type { Database } from '@/types/database.types';

export type WartaJemaat = Database['public']['Tables']['warta_jemaat']['Row'];
export type WartaJemaatInsert = Database['public']['Tables']['warta_jemaat']['Insert'];

export type Pengumuman = Database['public']['Tables']['pengumuman']['Row'];
export type PengumumanInsert = Database['public']['Tables']['pengumuman']['Insert'];
