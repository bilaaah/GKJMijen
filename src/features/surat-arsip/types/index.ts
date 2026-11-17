import type { Database } from '@/types/database.types';

export type JenisSurat = Database['public']['Tables']['jenis_surat']['Row'];
export type JenisSuratInsert = Database['public']['Tables']['jenis_surat']['Insert'];

export type PermohonanSurat = Database['public']['Tables']['permohonan_surat']['Row'];
export type PermohonanSuratInsert = Database['public']['Tables']['permohonan_surat']['Insert'];

export type ArsipDokumen = Database['public']['Tables']['arsip_dokumen']['Row'];
export type ArsipDokumenInsert = Database['public']['Tables']['arsip_dokumen']['Insert'];

export interface PermohonanSuratFilterParams {
  status?: 'pending' | 'diproses' | 'selesai' | 'ditolak';
  jenisSuratId?: string;
}
