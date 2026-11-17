import type { UserRole } from '@/types/database.types';

export const USER_ROLES: Record<string, UserRole> = {
  SUPER_ADMIN: 'super_admin',
  PENDETA: 'pendeta',
  MAJELIS: 'majelis',
  TATA_USAHA: 'tata_usaha',
  BENDAHARA: 'bendahara',
  WARGA: 'warga',
} as const;

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Administrator',
  pendeta: 'Pendeta',
  majelis: 'Majelis Jemaat',
  tata_usaha: 'Tata Usaha / Sekretariat',
  bendahara: 'Bendahara Gereja',
  warga: 'Warga Jemaat',
};
