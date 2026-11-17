import { z } from 'zod';

export const permohonanSuratSchema = z.object({
  jenisSuratId: z.string().uuid('Jenis surat wajib dipilih'),
  jemaatId: z.string().uuid('Jemaat pemohon wajib dipilih'),
  keperluan: z.string().min(5, 'Keperluan surat minimal 5 karakter'),
  catatan: z.string().optional(),
});

export type PermohonanSuratFormInput = z.infer<typeof permohonanSuratSchema>;
