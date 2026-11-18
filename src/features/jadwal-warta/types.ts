/**
 * Modul Jadwal dan Warta - Types
 * Menyimpan definisi tipe data jadwal ibadah/kegiatan dan warta mingguan.
 */

export interface JadwalKegiatan {
  id: string;
  judul: string;
  waktu: string;
  lokasi: string;
  pelayanFirman?: string;
}

export interface WartaJemaat {
  id: string;
  edisi: string;
  tanggalTerbit: string;
  tema?: string;
  filePdfUrl?: string;
}

export interface JadwalKegiatanInput {
  judul: string;
  waktu: string;
  lokasi: string;
  pelayanFirman?: string;
}
