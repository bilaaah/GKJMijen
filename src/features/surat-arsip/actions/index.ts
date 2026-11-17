'use server';

import type { ActionResponse } from '@/types/common.types';
import type { PermohonanSurat, PermohonanSuratInsert } from '../types';

export async function submitPermohonanSuratAction(
  _data: PermohonanSuratInsert
): Promise<ActionResponse<PermohonanSurat>> {
  return {
    success: false,
    message: 'Scaffolding placeholder: submitPermohonanSuratAction belum diimplementasikan.',
  };
}

export async function updateStatusPermohonanAction(
  _id: string,
  _status: 'pending' | 'diproses' | 'selesai' | 'ditolak'
): Promise<ActionResponse<PermohonanSurat>> {
  return {
    success: false,
    message: 'Scaffolding placeholder: updateStatusPermohonanAction belum diimplementasikan.',
  };
}
