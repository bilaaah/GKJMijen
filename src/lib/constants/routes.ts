/**
 * Definisi Route URL aplikasi GKJ Mijen (4 Modul Utama + Pengaturan)
 */
export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },
  DASHBOARD: {
    ROOT: '/dashboard',
    JEMAAT: '/jemaat',
    JEMAAT_TAMBAH: '/jemaat/tambah',
    SURAT: '/surat',
    KEUANGAN: '/keuangan',
    KEUANGAN_TAMBAH: '/keuangan/tambah',
    KEUANGAN_LAPORAN: '/keuangan/laporan',
    JADWAL_WARTA: '/jadwal-warta',
    KEGIATAN_TAMBAH: '/jadwal-warta/kegiatan/tambah',
    WARTA: '/jadwal-warta/warta',
    WARTA_TULIS: '/jadwal-warta/warta/tulis',
    AKUN: '/akun',
    PROFIL: '/profil',
  },
  /** Portal Warga Jemaat (sisi user) */
  PORTAL: {
    ROOT: '/portal',
    AJUKAN: '/portal/ajukan',
    STATUS: '/portal/status',
    PROFIL: '/portal/profil',
  },
} as const;

export const routeJemaatDetail = (id: string) => `/jemaat/${id}`;
export const routeJemaatUbah = (id: string) => `/jemaat/${id}/ubah`;
export const routeSuratProses = (id: string) => `/surat/${id}`;
export const routeTransaksiUbah = (id: string) => `/keuangan/${id}`;
export const routeKegiatanUbah = (id: string) => `/jadwal-warta/kegiatan/${id}`;
export const routeWartaUbah = (id: string) => `/jadwal-warta/warta/${id}`;
export const routePortalSurat = (id: string) => `/portal/status/${id}`;
