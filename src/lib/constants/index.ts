export * from './routes';

export const APP_CONFIG = {
  NAME: 'GKJ Mijen',
  SHORT_NAME: 'GKJ Mijen',
  VERSION: '1.0.0',
  DEFAULT_PAGE_SIZE: 10,
  MAX_UPLOAD_SIZE_MB: 10,
} as const;

/** Bucket Supabase Storage (dibuat oleh supabase/schema.sql). Logika unggah ada di src/lib/data/files.ts. */
export const STORAGE_BUCKETS = {
  BUKTI_TRANSAKSI: 'bukti-transaksi',
  LAMPIRAN: 'lampiran',
  SURAT: 'surat',
  PUBLIK: 'publik',
} as const;
