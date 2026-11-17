import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import type { PermohonanSurat, PermohonanSuratInsert, PermohonanSuratFilterParams } from '../types';
import type { PaginatedResult, PaginationParams } from '@/types/common.types';

export interface ISuratArsipService {
  getPermohonanList(
    client: SupabaseClient<Database>,
    params: PaginationParams & PermohonanSuratFilterParams
  ): Promise<PaginatedResult<PermohonanSurat>>;

  createPermohonan(
    client: SupabaseClient<Database>,
    payload: PermohonanSuratInsert
  ): Promise<PermohonanSurat>;
}
