'use server';

import type { ActionResponse } from '@/types/common.types';
import type { Profile, ProfileUpdate } from '../types';

export async function updateUserProfileAction(
  _id: string,
  _data: ProfileUpdate
): Promise<ActionResponse<Profile>> {
  return {
    success: false,
    message: 'Scaffolding placeholder: updateUserProfileAction belum diimplementasikan.',
  };
}

export async function logActivityAction(
  _module: string,
  _action: string,
  _description: string
): Promise<ActionResponse<null>> {
  return {
    success: false,
    message: 'Scaffolding placeholder: logActivityAction belum diimplementasikan.',
  };
}
