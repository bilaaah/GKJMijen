import { z } from 'zod';

export const transaksiKeuanganSchema = z.object({
  nomorTransaksi: z.string().min(1, 'Nomor transaksi wajib diisi'),
  kategoriId: z.string().uuid('Kategori wajib dipilih'),
  tanggal: z.string().min(1, 'Tanggal transaksi wajib diisi'),
  tipe: z.enum(['pemasukan', 'pengeluaran']),
  jumlah: z.number().positive('Jumlah harus bernilai positif'),
  keterangan: z.string().optional(),
});

export const penghitunganPersembahanSchema = z.object({
  tanggalKebaktian: z.string().min(1, 'Tanggal kebaktian wajib diisi'),
  jenisKebaktian: z.string().min(1, 'Jenis kebaktian wajib diisi'),
  kantongMerah: z.number().nonnegative(),
  kantongHitam: z.number().nonnegative(),
  persembahanKhusus: z.number().nonnegative(),
  totalPersembahan: z.number().positive('Total persembahan harus lebih dari 0'),
});

export type TransaksiKeuanganFormInput = z.infer<typeof transaksiKeuanganSchema>;
export type PenghitunganPersembahanFormInput = z.infer<typeof penghitunganPersembahanSchema>;
