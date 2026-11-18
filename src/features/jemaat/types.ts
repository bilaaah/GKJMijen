/**
 * Modul Data Jemaat - Types
 * Menyimpan definisi tipe data jemaat, keluarga, dan wilayah.
 */

export interface Jemaat {
  id: string;
  nomorInduk: string;
  namaLengkap: string;
  jenisKelamin: 'L' | 'P';
  tanggalLahir: string;
  alamat: string;
  statusJemaat: 'aktif' | 'titipan' | 'pindah' | 'meninggal';
  createdAt?: string;
}

export interface JemaatInput {
  nomorInduk: string;
  namaLengkap: string;
  jenisKelamin: 'L' | 'P';
  tanggalLahir: string;
  alamat: string;
  statusJemaat: 'aktif' | 'titipan' | 'pindah' | 'meninggal';
}
