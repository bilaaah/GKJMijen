/**
 * Definisi Role Pengguna SIM GKJ Mijen
 * Sistem memiliki 2 role utama:
 * 1. warga (Warga Jemaat)
 * 2. pengurus (Pengurus Gereja)
 */

export type UserRole = 'warga' | 'pengurus';

export const USER_ROLES = {
  WARGA: 'warga' as UserRole,
  PENGURUS: 'pengurus' as UserRole,
};

export const ROLE_LABELS: Record<UserRole, string> = {
  warga: 'Warga Jemaat',
  pengurus: 'Pengurus Gereja',
};
