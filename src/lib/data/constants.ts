import type { JenisSurat, StatusSurat } from './types';

export const WILAYAH = ['Wilayah 1 – Mijen', 'Wilayah 2 – Jatibarang', 'Wilayah 3 – Wonoplumbon'];

export const KATEGORI_TRANSAKSI = ['Persembahan', 'Persepuluhan', 'Diakonia', 'Operasional', 'Pembangunan', 'Lainnya'];

export const JENIS_SURAT_LABEL: Record<JenisSurat, string> = {
  baptis: 'Surat Baptis',
  sidi: 'Surat Sidi',
  atestasi: 'Surat Atestasi',
};

export const JENIS_SURAT_KODE: Record<JenisSurat, string> = {
  baptis: 'BPT',
  sidi: 'SDI',
  atestasi: 'ATS',
};

export const STATUS_SURAT: StatusSurat[] = ['diajukan', 'diproses', 'selesai', 'ditolak'];

export const STATUS_SURAT_LABEL: Record<StatusSurat, string> = {
  diajukan: 'Diajukan',
  diproses: 'Diproses',
  selesai: 'Selesai',
  ditolak: 'Ditolak',
};

export type Tone = 'ok' | 'warn' | 'info' | 'bad' | 'neu' | 'rose';

export const STATUS_SURAT_TONE: Record<StatusSurat, Tone> = {
  diajukan: 'info',
  diproses: 'warn',
  selesai: 'ok',
  ditolak: 'bad',
};

export const DEMO_EMAIL = 'yohanes.prasetyo@gkjmijen.or.id';
