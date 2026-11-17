import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import type { Profile, ActivityLog } from '../types';
import type { PaginatedResult, PaginationParams } from '@/types/common.types';

export interface IPenggunaAksesService {
  getProfilesList(
    client: SupabaseClient<Database>,
    params: PaginationParams
  ): Promise<PaginatedResult<Profile>>;

  getActivityLogs(
    client: SupabaseClient<Database>,
    params: PaginationParams
  ): Promise<PaginatedResult<ActivityLog>>;
}
