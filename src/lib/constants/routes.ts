/**
 * Definisi Route URL aplikasi SIM GKJ Mijen
 */
export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/login',
    FORGOT_PASSWORD: '/forgot-password',
  },
  DASHBOARD: {
    ROOT: '/',
    JEMAAT: {
      ROOT: '/jemaat',
      KELUARGA: '/jemaat/keluarga',
      WILAYAH: '/jemaat/wilayah',
      SAKRAMEN: '/jemaat/sakramen',
    },
    SURAT_ARSIP: {
      ROOT: '/surat-arsip',
      PERMOHONAN: '/surat-arsip/permohonan',
      JENIS_SURAT: '/surat-arsip/jenis-surat',
      ARSIP: '/surat-arsip/arsip',
    },
    KEUANGAN: {
      ROOT: '/keuangan',
      TRANSAKSI: '/keuangan/transaksi',
      PERSEMBAHAN: '/keuangan/persembahan',
      KATEGORI: '/keuangan/kategori',
      LAPORAN: '/keuangan/laporan',
    },
    JADWAL_KEGIATAN: {
      ROOT: '/jadwal-kegiatan',
      KOMISI: '/jadwal-kegiatan/komisi',
      KEGIATAN: '/jadwal-kegiatan/kegiatan',
      PETUGAS: '/jadwal-kegiatan/petugas',
    },
    WARTA_PENGUMUMAN: {
      ROOT: '/warta-pengumuman',
      WARTA: '/warta-pengumuman/warta',
      PENGUMUMAN: '/warta-pengumuman/pengumuman',
    },
    PENGGUNA_AKSES: {
      ROOT: '/pengguna-akses',
      USERS: '/pengguna-akses/users',
      ROLES: '/pengguna-akses/roles',
      ACTIVITY_LOGS: '/pengguna-akses/activity-logs',
    },
  },
} as const;
