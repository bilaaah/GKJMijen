'use client';

import { createContext, useContext } from 'react';
import type { DB, Profile, Peran } from './types';

export type LoginResult = { ok: true; nama: string; peran: Peran } | { ok: false; reason: 'invalid' | 'warga' | 'unconfirmed' | 'error'; message?: string };
export type RegisterResult = { ok: true; perluKonfirmasi: boolean } | { ok: false; field: 'email' | 'form'; message: string };
export type SimpleResult = { ok: true } | { ok: false; message: string };

export interface DataContextValue {
  /** 'supabase' = data asli dari database, 'demo' = data contoh (kunci Supabase belum diisi). */
  mode: 'supabase' | 'demo';
  db: DB;
  ready: boolean;
  /** Profil pengurus yang sedang login (null jika belum login atau bukan pengurus). */
  user: Profile | null;
  /**
   * Ubah data. Tampilan langsung diperbarui, lalu perubahannya disimpan ke Supabase
   * di belakang layar (tambah / ubah / hapus baris dideteksi otomatis).
   */
  setDb: (updater: (db: DB) => DB) => void;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
  register: (input: { nama: string; email: string; password: string }) => Promise<RegisterResult>;
  kirimResetPassword: (email: string) => Promise<SimpleResult>;
  gantiPassword: (passwordBaru: string) => Promise<SimpleResult>;
  updateUser: (patch: Partial<Profile>) => void;
  /** Muat ulang semua data dari database (mode demo: kembalikan data contoh). */
  resetData: () => void;
}

export const DataContext = createContext<DataContextValue | null>(null);

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData harus dipakai di dalam <DataProvider>.');
  return ctx;
}

/** ID baru untuk baris yang dibuat dari tampilan (UUID, sama dengan format kunci primer di database). */
export function newId(_prefix?: string): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  // cadangan untuk browser lama
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}
