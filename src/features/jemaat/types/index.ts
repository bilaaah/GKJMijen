import type { Database } from '@/types/database.types';

export type Jemaat = Database['public']['Tables']['jemaat']['Row'];
export type JemaatInsert = Database['public']['Tables']['jemaat']['Insert'];
export type JemaatUpdate = Database['public']['Tables']['jemaat']['Update'];

export type Keluarga = Database['public']['Tables']['keluarga']['Row'];
export type KeluargaInsert = Database['public']['Tables']['keluarga']['Insert'];
export type KeluargaUpdate = Database['public']['Tables']['keluarga']['Update'];

export type Wilayah = Database['public']['Tables']['wilayah']['Row'];
export type WilayahInsert = Database['public']['Tables']['wilayah']['Insert'];
export type WilayahUpdate = Database['public']['Tables']['wilayah']['Update'];

export type RiwayatSakramen = Database['public']['Tables']['riwayat_sakramen']['Row'];
export type RiwayatSakramenInsert = Database['public']['Tables']['riwayat_sakramen']['Insert'];
export type RiwayatSakramenUpdate = Database['public']['Tables']['riwayat_sakramen']['Update'];

export interface JemaatFilterParams {
  wilayahId?: string;
  statusJemaat?: string;
  search?: string;
}
