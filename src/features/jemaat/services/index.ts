/**
 * Data Access Services for Jemaat Module (Contract / Interface signatures)
 * Bertanggung jawab terhadap database query melalui Supabase Client.
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import type { Jemaat, JemaatInsert, JemaatFilterParams } from '../types';
import type { PaginatedResult, PaginationParams } from '@/types/common.types';

export interface IJemaatService {
  getJemaatList(
    client: SupabaseClient<Database>,
    params: PaginationParams & JemaatFilterParams
  ): Promise<PaginatedResult<Jemaat>>;

  getJemaatById(
    client: SupabaseClient<Database>,
    id: string
  ): Promise<Jemaat | null>;

  createJemaat(
    client: SupabaseClient<Database>,
    payload: JemaatInsert
  ): Promise<Jemaat>;
}
