import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import type { JadwalKegiatan, JadwalKegiatanInsert } from '../types';
import type { PaginatedResult, PaginationParams } from '@/types/common.types';

export interface IJadwalKegiatanService {
  getJadwalList(
    client: SupabaseClient<Database>,
    params: PaginationParams
  ): Promise<PaginatedResult<JadwalKegiatan>>;

  createJadwal(
    client: SupabaseClient<Database>,
    payload: JadwalKegiatanInsert
  ): Promise<JadwalKegiatan>;
}
