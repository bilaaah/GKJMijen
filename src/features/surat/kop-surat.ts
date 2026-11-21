/**
 * PENGATURAN SURAT RESMI GKJ MIJEN
 * Ubah isi file ini bila kop, penanda tangan, atau format nomor surat berubah.
 * Acuan: surat resmi GKJ Mijen No. 76/GKJ-MJ/XI/2026 (kop, salam, format nomor, penanda tangan).
 */
import type { PermohonanSurat } from '@/lib/data/types';

export const KOP = {
  nama: 'GEREJA KRISTEN JAWA MIJEN SEMARANG',
  persekutuan: '(DALAM PERSEKUTUAN GEREJA-GEREJA DI INDONESIA)',
  alamat: 'Alamat : Jl. RM Hadi Soebeno Sosrowardoyo, Kode Pos 50215',
  kontak: 'Telp (024) 7711150 · Email gkjmijensemarang@gmail.com',
  /** Logo hitam di latar putih (public/images). */
  logo: '/images/logo-gkj-kop.png',
  kota: 'Semarang',
};

export const PENANDATANGAN = {
  salamPenutup: 'Hormat kami,',
  jabatan: 'Pendeta GKJ Mijen Semarang',
  nama: 'Pdt. Denny Irawan, S.Si-Teol',
};

export const SALAM = 'Salam sejahtera dalam kasih Tuhan Yesus Kristus.';

const ROMAWI = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

/** Format nomor gereja: <urut>/GKJ-MJ/<bulan romawi>/<tahun>, contoh 76/GKJ-MJ/XI/2026. */
export function formatNomor(urut: number, tanggal: Date): string {
  return `${urut}/GKJ-MJ/${ROMAWI[tanggal.getMonth()]}/${tanggal.getFullYear()}`;
}

const POLA_NOMOR = /^0*(\d+)\/GKJ-MJ\/[IVX]+\/(\d{4})$/;

/**
 * Usulan nomor berikutnya: nomor urut terbesar tahun ini (dari surat yang sudah tercatat di sistem) + 1.
 * Sekretariat tetap bisa mengubahnya bila nomor agenda gereja berbeda.
 */
export function usulanNomor(semua: PermohonanSurat[], tanggal = new Date()): string {
  const tahun = String(tanggal.getFullYear());
  const max = semua.reduce((m, x) => {
    const hit = POLA_NOMOR.exec((x.nomor_surat || '').trim());
    return hit && hit[2] === tahun ? Math.max(m, Number(hit[1])) : m;
  }, 0);
  return formatNomor(max + 1, tanggal);
}
