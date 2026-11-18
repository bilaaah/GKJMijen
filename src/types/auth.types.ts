import type { UserRole } from '@/lib/auth/roles';

export type { UserRole };

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  phone?: string | null;
}
