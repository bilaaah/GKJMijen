/**
 * Definisi Route URL aplikasi SIM GKJ Mijen (4 Modul Utama)
 */
export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/login',
    FORGOT_PASSWORD: '/forgot-password',
  },
  DASHBOARD: {
    ROOT: '/',
    JEMAAT: '/jemaat',
    SURAT: '/surat',
    KEUANGAN: '/keuangan',
    JADWAL_WARTA: '/jadwal-warta',
  },
} as const;
