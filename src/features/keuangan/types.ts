/**
 * Modul Keuangan - Types
 * Menyimpan definisi tipe data transaksi kas dan persembahan.
 */

export interface Transaksi {
  id: string;
  nomorTransaksi: string;
  tanggal: string;
  tipe: 'pemasukan' | 'pengeluaran';
  kategori: string;
  jumlah: number;
  keterangan?: string;
  createdAt?: string;
}

export interface TransaksiInput {
  tanggal: string;
  tipe: 'pemasukan' | 'pengeluaran';
  kategori: string;
  jumlah: number;
  keterangan?: string;
}
