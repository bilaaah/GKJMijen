'use server';

import type { SuratPermohonan, SuratPermohonanInput } from './types';

/**
 * Modul Layanan Surat - Server Actions (Backend)
 * Placeholder operasi permohonan surat jemaat melalui Supabase.
 */

export async function submitPermohonanSuratAction(_data: SuratPermohonanInput): Promise<{ success: boolean; message: string; data?: SuratPermohonan }> {
  // TODO [Backend Team]: Implementasikan verifikasi session dan query insert surat ke Supabase
  return {
    success: false,
    message: 'Placeholder: submitPermohonanSuratAction belum diimplementasikan.',
  };
}

export async function updateStatusSuratAction(_id: string, _status: SuratPermohonan['status']): Promise<{ success: boolean; message: string }> {
  // TODO [Backend Team]: Implementasikan update status persetujuan surat oleh Pengurus Gereja
  return {
    success: false,
    message: 'Placeholder: updateStatusSuratAction belum diimplementasikan.',
  };
}
