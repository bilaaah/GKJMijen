import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import type { WartaJemaat, WartaJemaatInsert } from '../types';
import type { PaginatedResult, PaginationParams } from '@/types/common.types';

export interface IWartaPengumumanService {
  getWartaList(
    client: SupabaseClient<Database>,
    params: PaginationParams
  ): Promise<PaginatedResult<WartaJemaat>>;

  createWarta(
    client: SupabaseClient<Database>,
    payload: WartaJemaatInsert
  ): Promise<WartaJemaat>;
}
