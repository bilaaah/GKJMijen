import type { UserRole, Permission } from '@/types/auth.types';

/**
 * Matriks Hak Akses (Role-Based Access Control)
 * Memetakan setiap UserRole dengan daftar izin (permissions).
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: [
    'jemaat:read',
    'jemaat:create',
    'jemaat:update',
    'jemaat:delete',
    'surat:read',
    'surat:create',
    'surat:update',
    'surat:delete',
    'keuangan:read',
    'keuangan:create',
    'keuangan:update',
    'keuangan:delete',
    'jadwal:read',
    'jadwal:create',
    'jadwal:update',
    'jadwal:delete',
    'warta:read',
    'warta:create',
    'warta:update',
    'warta:delete',
    'users:manage',
  ],
  pendeta: [
    'jemaat:read',
    'surat:read',
    'surat:create',
    'surat:update',
    'keuangan:read',
    'jadwal:read',
    'jadwal:create',
    'jadwal:update',
    'warta:read',
    'warta:create',
    'warta:update',
  ],
  majelis: [
    'jemaat:read',
    'surat:read',
    'keuangan:read',
    'jadwal:read',
    'jadwal:create',
    'jadwal:update',
    'warta:read',
  ],
  tata_usaha: [
    'jemaat:read',
    'jemaat:create',
    'jemaat:update',
    'surat:read',
    'surat:create',
    'surat:update',
    'surat:delete',
    'jadwal:read',
    'jadwal:create',
    'jadwal:update',
    'warta:read',
    'warta:create',
    'warta:update',
  ],
  bendahara: [
    'jemaat:read',
    'keuangan:read',
    'keuangan:create',
    'keuangan:update',
    'keuangan:delete',
    'jadwal:read',
  ],
  warga: ['jemaat:read', 'surat:create', 'jadwal:read', 'warta:read'],
};

/**
 * Helper untuk memvalidasi apakah suatu role memiliki permission tertentu
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}
