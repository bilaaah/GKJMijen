'use server';

import type { ActionResponse } from '@/types/common.types';
import type { WartaJemaat, WartaJemaatInsert } from '../types';

export async function createWartaAction(
  _data: WartaJemaatInsert
): Promise<ActionResponse<WartaJemaat>> {
  return {
    success: false,
    message: 'Scaffolding placeholder: createWartaAction belum diimplementasikan.',
  };
}

export async function publishWartaAction(
  _id: string
): Promise<ActionResponse<WartaJemaat>> {
  return {
    success: false,
    message: 'Scaffolding placeholder: publishWartaAction belum diimplementasikan.',
  };
}
