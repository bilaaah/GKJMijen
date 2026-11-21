/**
 * Tipe database Supabase SIM GKJ Mijen (sesuai ERD laporan & supabase/schema.sql).
 * Format mengikuti hasil `supabase gen types typescript`. Jika skema database
 * berubah, perbarui file ini (atau generate ulang dengan Supabase CLI).
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

/** Ratakan intersection menjadi satu objek (bentuk yang diharapkan supabase-js). */
type Rata<T> = { [K in keyof T]: T[K] };
type Waktu = { created_at: string; updated_at: string };
type WaktuOpsional = { created_at?: string; updated_at?: string };

type ProfilesRow = Rata<{ id: string; nama: string | null; email: string | null; peran: 'warga' | 'pengurus' } & Waktu>;
type JemaatRow = Rata<{
  id_jemaat: string;
  id_profiles: string | null;
  nama: string;
  no_hp: string | null;
  alamat: string | null;
  data_keluarga: string | null;
  wilayah: string | null;
  status_baptis: boolean;
  status_sidi: boolean;
} & Waktu>;
type PermohonanRow = Rata<{
  id_permohonan: string;
  id_jemaat: string;
  id_pengurus: string | null;
  jenis_surat: 'baptis' | 'sidi' | 'atestasi';
  tanggal_pengajuan: string;
  status: 'diajukan' | 'diproses' | 'selesai' | 'ditolak';
  catatan: string | null;
  nomor_surat: string | null;
  keterangan: string | null;
  url_lampiran: string | null;
  url_surat: string | null;
} & Waktu>;
type TransaksiRow = Rata<{
  id_transaksi: string;
  id_profiles: string | null;
  tanggal: string;
  jenis_transaksi: 'pemasukan' | 'pengeluaran';
  kategori: string;
  nominal: number;
  keterangan: string | null;
  bukti_url: string | null;
} & Waktu>;
type KegiatanRow = Rata<{
  id_kegiatan: string;
  id_profiles: string | null;
  nama_kegiatan: string;
  tanggal: string;
  jam: string | null;
  lokasi: string | null;
  petugas: string | null;
  url_poster: string | null;
} & Waktu>;
type WartaRow = Rata<{
  id_warta: string;
  id_profiles: string | null;
  judul: string;
  isi: string | null;
  status: 'draf' | 'terbit';
  tanggal_terbit: string | null;
  url_pdf: string | null;
} & Waktu>;

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: ProfilesRow;
        Insert: Rata<Partial<Omit<ProfilesRow, 'id'>> & { id: string } & WaktuOpsional>;
        Update: Partial<ProfilesRow>;
        Relationships: [];
      };
      jemaat: {
        Row: JemaatRow;
        Insert: Rata<Partial<Omit<JemaatRow, 'nama'>> & { nama: string } & WaktuOpsional>;
        Update: Partial<JemaatRow>;
        Relationships: [];
      };
      permohonan_surat: {
        Row: PermohonanRow;
        Insert: Rata<Partial<Omit<PermohonanRow, 'id_jemaat' | 'jenis_surat'>> & Pick<PermohonanRow, 'id_jemaat' | 'jenis_surat'> & WaktuOpsional>;
        Update: Partial<PermohonanRow>;
        Relationships: [];
      };
      transaksi_keuangan: {
        Row: TransaksiRow;
        Insert: Rata<Partial<Omit<TransaksiRow, 'jenis_transaksi' | 'kategori' | 'nominal'>> & Pick<TransaksiRow, 'jenis_transaksi' | 'kategori' | 'nominal'> & WaktuOpsional>;
        Update: Partial<TransaksiRow>;
        Relationships: [];
      };
      kegiatan: {
        Row: KegiatanRow;
        Insert: Rata<Partial<Omit<KegiatanRow, 'nama_kegiatan' | 'tanggal'>> & Pick<KegiatanRow, 'nama_kegiatan' | 'tanggal'> & WaktuOpsional>;
        Update: Partial<KegiatanRow>;
        Relationships: [];
      };
      warta: {
        Row: WartaRow;
        Insert: Rata<Partial<Omit<WartaRow, 'judul'>> & { judul: string } & WaktuOpsional>;
        Update: Partial<WartaRow>;
        Relationships: [];
      };
    };
    Views: {
      rekap_bulanan: {
        Row: { bulan: string | null; total_pemasukan: number | null; total_pengeluaran: number | null; selisih: number | null };
        Relationships: [];
      };
      saldo_kas: {
        Row: { saldo: number | null };
        Relationships: [];
      };
    };
    Functions: {
      is_pengurus: { Args: Record<PropertyKey, never>; Returns: boolean };
      hapus_akun: { Args: { target: string }; Returns: undefined };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
