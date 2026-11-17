import { z } from 'zod';

export const jadwalKegiatanSchema = z.object({
  judulKegiatan: z.string().min(3, 'Judul kegiatan minimal 3 karakter'),
  komisiId: z.string().uuid().optional().nullable(),
  waktuMulai: z.string().min(1, 'Waktu mulai wajib diisi'),
  waktuSelesai: z.string().optional().nullable(),
  lokasi: z.string().min(2, 'Lokasi kegiatan wajib diisi'),
  keterangan: z.string().optional(),
});

export const penugasanPetugasSchema = z.object({
  jadwalKegiatanId: z.string().uuid('ID Jadwal kegiatan tidak valid'),
  jemaatId: z.string().uuid('Petugas jemaat wajib dipilih'),
  peranPetugas: z.string().min(1, 'Peran petugas wajib diisi'),
  statusKonfirmasi: z.enum(['menunggu', 'bersedia', 'berhalangan']),
});

export type JadwalKegiatanFormInput = z.infer<typeof jadwalKegiatanSchema>;
export type PenugasanPetugasFormInput = z.infer<typeof penugasanPetugasSchema>;
