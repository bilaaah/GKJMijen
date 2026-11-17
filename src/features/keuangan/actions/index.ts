'use server';

import type { ActionResponse } from '@/types/common.types';
import type { TransaksiKeuangan, TransaksiKeuanganInsert } from '../types';

export async function createTransaksiAction(
  _data: TransaksiKeuanganInsert
): Promise<ActionResponse<TransaksiKeuangan>> {
  return {
    success: false,
    message: 'Scaffolding placeholder: createTransaksiAction belum diimplementasikan.',
  };
}

export async function submitPersembahanAction(
  _data: unknown
): Promise<ActionResponse<unknown>> {
  return {
    success: false,
    message: 'Scaffolding placeholder: submitPersembahanAction belum diimplementasikan.',
  };
}
