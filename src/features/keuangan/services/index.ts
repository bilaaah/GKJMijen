import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import type { TransaksiKeuangan, TransaksiKeuanganInsert, KeuanganFilterParams } from '../types';
import type { PaginatedResult, PaginationParams } from '@/types/common.types';

export interface IKeuanganService {
  getTransaksiList(
    client: SupabaseClient<Database>,
    params: PaginationParams & KeuanganFilterParams
  ): Promise<PaginatedResult<TransaksiKeuangan>>;

  createTransaksi(
    client: SupabaseClient<Database>,
    payload: TransaksiKeuanganInsert
  ): Promise<TransaksiKeuangan>;
}
