export * from './routes';

export const APP_CONFIG = {
  NAME: 'SIM GKJ Mijen',
  SHORT_NAME: 'GKJ Mijen',
  VERSION: '1.0.0',
  DEFAULT_PAGE_SIZE: 10,
  MAX_UPLOAD_SIZE_MB: 10,
} as const;

export const STORAGE_BUCKETS = {
  DOCUMENTS: process.env.NEXT_PUBLIC_STORAGE_BUCKET_DOCS || 'documents',
  WARTA: process.env.NEXT_PUBLIC_STORAGE_BUCKET_WARTE || 'warta',
  AVATARS: process.env.NEXT_PUBLIC_STORAGE_BUCKET_AVATARS || 'avatars',
} as const;
