import type { UserRole } from './database.types';

export type { UserRole };

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  phone?: string | null;
  avatarUrl?: string | null;
  isActive: boolean;
}

export type Permission =
  | 'jemaat:read'
  | 'jemaat:create'
  | 'jemaat:update'
  | 'jemaat:delete'
  | 'surat:read'
  | 'surat:create'
  | 'surat:update'
  | 'surat:delete'
  | 'keuangan:read'
  | 'keuangan:create'
  | 'keuangan:update'
  | 'keuangan:delete'
  | 'jadwal:read'
  | 'jadwal:create'
  | 'jadwal:update'
  | 'jadwal:delete'
  | 'warta:read'
  | 'warta:create'
  | 'warta:update'
  | 'warta:delete'
  | 'users:manage';
