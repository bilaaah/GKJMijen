'use server';

import type { ActionResponse } from '@/types/common.types';
import type { JadwalKegiatan, JadwalKegiatanInsert } from '../types';

export async function createJadwalAction(
  _data: JadwalKegiatanInsert
): Promise<ActionResponse<JadwalKegiatan>> {
  return {
    success: false,
    message: 'Scaffolding placeholder: createJadwalAction belum diimplementasikan.',
  };
}
