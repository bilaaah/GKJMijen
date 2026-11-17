import { z } from 'zod';

export const jemaatSchema = z.object({
  nomorInduk: z.string().min(1, 'Nomor induk jemaat wajib diisi'),
  keluargaId: z.string().uuid('ID Keluarga tidak valid'),
  wilayahId: z.string().uuid('ID Wilayah tidak valid'),
  namaLengkap: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
  namaPanggilan: z.string().optional(),
  jenisKelamin: z.enum(['L', 'P']),
  tempatLahir: z.string().min(1, 'Tempat lahir wajib diisi'),
  tanggalLahir: z.string().min(1, 'Tanggal lahir wajib diisi'),
  statusDalamKeluarga: z.string().min(1, 'Status dalam keluarga wajib diisi'),
  statusPernikahan: z.string().min(1, 'Status pernikahan wajib diisi'),
  statusJemaat: z.enum(['aktif', 'titipan', 'pindah', 'meninggal']),
});

export type JemaatFormInput = z.infer<typeof jemaatSchema>;
