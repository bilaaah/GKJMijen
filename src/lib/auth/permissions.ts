import type { UserRole } from './roles';

export type Permission =
  | 'jemaat:read'
  | 'jemaat:manage'
  | 'surat:read'
  | 'surat:apply'
  | 'surat:manage'
  | 'keuangan:read'
  | 'keuangan:manage'
  | 'jadwal_warta:read'
  | 'jadwal_warta:manage';

/**
 * Matriks Hak Akses (2 Role: Warga & Pengurus)
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  warga: [
    'jemaat:read',
    'surat:read',
    'surat:apply',
    'jadwal_warta:read',
  ],
  pengurus: [
    'jemaat:read',
    'jemaat:manage',
    'surat:read',
    'surat:apply',
    'surat:manage',
    'keuangan:read',
    'keuangan:manage',
    'jadwal_warta:read',
    'jadwal_warta:manage',
  ],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}
