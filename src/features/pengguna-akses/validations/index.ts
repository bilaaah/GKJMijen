import { z } from 'zod';

export const userProfileSchema = z.object({
  fullName: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
  role: z.enum(['super_admin', 'pendeta', 'majelis', 'tata_usaha', 'bendahara', 'warga']),
  phone: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type UserProfileFormInput = z.infer<typeof userProfileSchema>;
