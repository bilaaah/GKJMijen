import type { UserRole } from '@/lib/auth/roles';

export type { UserRole };

/**
 * Placeholder Definisi Tipe Database Supabase (4 Modul Utama & 2 Role)
 */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          role: UserRole;
          phone: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          role?: UserRole;
          phone?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          role?: UserRole;
          phone?: string | null;
        };
      };
      jemaat: {
        Row: {
          id: string;
          nomor_induk: string;
          nama_lengkap: string;
          jenis_kelamin: 'L' | 'P';
          tanggal_lahir: string;
          alamat: string;
          status_jemaat: 'aktif' | 'titipan' | 'pindah' | 'meninggal';
          created_at: string;
        };
        Insert: {
          id?: string;
          nomor_induk: string;
          nama_lengkap: string;
          jenis_kelamin: 'L' | 'P';
          tanggal_lahir: string;
          alamat: string;
          status_jemaat?: 'aktif' | 'titipan' | 'pindah' | 'meninggal';
          created_at?: string;
        };
        Update: {
          id?: string;
          nomor_induk?: string;
          nama_lengkap?: string;
          jenis_kelamin?: 'L' | 'P';
          tanggal_lahir?: string;
          alamat?: string;
          status_jemaat?: 'aktif' | 'titipan' | 'pindah' | 'meninggal';
        };
      };
      permohonan_surat: {
        Row: {
          id: string;
          nomor_permohonan: string;
          jenis_surat: string;
          jemaat_id: string;
          keperluan: string;
          status: 'pending' | 'diproses' | 'selesai' | 'ditolak';
          created_at: string;
        };
        Insert: {
          id?: string;
          nomor_permohonan: string;
          jenis_surat: string;
          jemaat_id: string;
          keperluan: string;
          status?: 'pending' | 'diproses' | 'selesai' | 'ditolak';
          created_at?: string;
        };
        Update: {
          id?: string;
          nomor_permohonan?: string;
          jenis_surat?: string;
          jemaat_id?: string;
          keperluan?: string;
          status?: 'pending' | 'diproses' | 'selesai' | 'ditolak';
        };
      };
      transaksi_keuangan: {
        Row: {
          id: string;
          nomor_transaksi: string;
          tanggal: string;
          tipe: 'pemasukan' | 'pengeluaran';
          kategori: string;
          jumlah: number;
          keterangan: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          nomor_transaksi: string;
          tanggal: string;
          tipe: 'pemasukan' | 'pengeluaran';
          kategori: string;
          jumlah: number;
          keterangan?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          nomor_transaksi?: string;
          tanggal?: string;
          tipe?: 'pemasukan' | 'pengeluaran';
          kategori?: string;
          jumlah?: number;
          keterangan?: string | null;
        };
      };
      jadwal_kegiatan: {
        Row: {
          id: string;
          judul: string;
          waktu: string;
          lokasi: string;
          pelayan_firman: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          judul: string;
          waktu: string;
          lokasi: string;
          pelayan_firman?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          judul?: string;
          waktu?: string;
          lokasi?: string;
          pelayan_firman?: string | null;
        };
      };
      warta_jemaat: {
        Row: {
          id: string;
          edisi: string;
          tanggal_terbit: string;
          tema: string | null;
          file_pdf_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          edisi: string;
          tanggal_terbit: string;
          tema?: string | null;
          file_pdf_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          edisi?: string;
          tanggal_terbit?: string;
          tema?: string | null;
          file_pdf_url?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: UserRole;
    };
  };
}
