import type { Database } from '@/types/database.types';

export type KategoriKeuangan = Database['public']['Tables']['kategori_keuangan']['Row'];
export type KategoriKeuanganInsert = Database['public']['Tables']['kategori_keuangan']['Insert'];

export type TransaksiKeuangan = Database['public']['Tables']['transaksi_keuangan']['Row'];
export type TransaksiKeuanganInsert = Database['public']['Tables']['transaksi_keuangan']['Insert'];

export type PenghitunganPersembahan = Database['public']['Tables']['penghitungan_persembahan']['Row'];
export type PenghitunganPersembahanInsert = Database['public']['Tables']['penghitungan_persembahan']['Insert'];

export interface KeuanganFilterParams {
  tipe?: 'pemasukan' | 'pengeluaran';
  kategoriId?: string;
  startDate?: string;
  endDate?: string;
}
