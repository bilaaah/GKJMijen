/**
 * Modul Layanan Surat - Types
 * Menyimpan definisi tipe data permohonan surat dan jenis surat.
 */

export interface SuratPermohonan {
  id: string;
  nomorPermohonan: string;
  jenisSurat: string;
  namaPemohon: string;
  keperluan: string;
  status: 'pending' | 'diproses' | 'selesai' | 'ditolak';
  createdAt?: string;
}

export interface SuratPermohonanInput {
  jenisSurat: string;
  keperluan: string;
  catatan?: string;
}
