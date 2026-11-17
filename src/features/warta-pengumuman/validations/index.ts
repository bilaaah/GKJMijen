import { z } from 'zod';

export const wartaJemaatSchema = z.object({
  edisi: z.string().min(1, 'Nomor edisi warta wajib diisi'),
  tanggalTerbit: z.string().min(1, 'Tanggal terbit wajib diisi'),
  tema: z.string().optional(),
  statusPublikasi: z.enum(['draft', 'dipublikasikan', 'diarsipkan']),
});

export const pengumumanSchema = z.object({
  judul: z.string().min(3, 'Judul pengumuman minimal 3 karakter'),
  konten: z.string().min(10, 'Konten pengumuman minimal 10 karakter'),
  kategori: z.string().min(1, 'Kategori wajib diisi'),
  tanggalMulai: z.string().min(1, 'Tanggal mulai wajib diisi'),
  tanggalSelesai: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type WartaJemaatFormInput = z.infer<typeof wartaJemaatSchema>;
export type PengumumanFormInput = z.infer<typeof pengumumanSchema>;
