'use server';

import type { Transaksi, TransaksiInput } from './types';

/**
 * Modul Keuangan - Server Actions (Backend)
 * Placeholder operasi pencatatan transaksi kas & persembahan melalui Supabase.
 */

export async function createTransaksiAction(_data: TransaksiInput): Promise<{ success: boolean; message: string; data?: Transaksi }> {
  // TODO [Backend Team]: Implementasikan validasi transaksi dan insert ke tabel Supabase
  return {
    success: false,
    message: 'Placeholder: createTransaksiAction belum diimplementasikan.',
  };
}

export async function getRingkasanKeuanganAction(): Promise<{ totalPemasukan: number; totalPengeluaran: number; saldo: number }> {
  // TODO [Backend Team]: Implementasikan kueri agregasi kas Supabase
  return {
    totalPemasukan: 0,
    totalPengeluaran: 0,
    saldo: 0,
  };
}
