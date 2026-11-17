import type { Database } from '@/types/database.types';

export type Komisi = Database['public']['Tables']['komisi']['Row'];
export type KomisiInsert = Database['public']['Tables']['komisi']['Insert'];

export type AnggotaKomisi = Database['public']['Tables']['anggota_komisi']['Row'];
export type AnggotaKomisiInsert = Database['public']['Tables']['anggota_komisi']['Insert'];

export type JadwalKegiatan = Database['public']['Tables']['jadwal_kegiatan']['Row'];
export type JadwalKegiatanInsert = Database['public']['Tables']['jadwal_kegiatan']['Insert'];

export type PenugasanPetugas = Database['public']['Tables']['penugasan_petugas']['Row'];
export type PenugasanPetugasInsert = Database['public']['Tables']['penugasan_petugas']['Insert'];
