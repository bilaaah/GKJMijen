'use client';

/**
 * Penyimpanan data sementara untuk mode frontend tanpa backend.
 * Data disimpan di memori dan sessionStorage tab browser, jadi perubahan
 * bertahan saat pindah halaman atau refresh, tetapi hilang saat tab ditutup.
 *
 * TODO [Backend]: ganti pemanggilan useMock() dengan Server Actions di
 * src/features/*\/actions.ts setelah Supabase siap.
 */

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { SEED } from './data';
import type { MockDB, Profile } from './types';

const STORAGE_KEY = 'gkj-mijen-mock-v1';

type LoginResult = { ok: true } | { ok: false; reason: 'invalid' | 'warga' };
type RegisterResult = { ok: true } | { ok: false; field: 'email'; message: string };

interface MockContextValue {
  db: MockDB;
  ready: boolean;
  user: Profile | null;
  setDb: (updater: (db: MockDB) => MockDB) => void;
  login: (email: string, password: string) => LoginResult;
  logout: () => void;
  register: (input: { nama: string; email: string }) => RegisterResult;
  updateUser: (patch: Partial<Profile>) => void;
  resetData: () => void;
}

const MockContext = createContext<MockContextValue | null>(null);

export function newId(prefix: string): string {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export function MockProvider({ children }: { children: React.ReactNode }) {
  const [db, setDbState] = useState<MockDB>(SEED);
  const [userId, setUserId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { db?: MockDB; userId?: string | null };
        if (saved.db) setDbState(saved.db);
        if (saved.userId) setUserId(saved.userId);
      }
    } catch {
      /* sessionStorage tidak tersedia: tetap pakai data contoh */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ db, userId }));
    } catch {
      /* kuota penuh (misalnya gambar besar): abaikan */
    }
  }, [db, userId, ready]);

  const setDb = useCallback((updater: (db: MockDB) => MockDB) => setDbState((prev) => updater(prev)), []);

  const user = useMemo(() => db.profiles.find((p) => p.id === userId) ?? null, [db.profiles, userId]);

  const login = useCallback(
    (email: string, password: string): LoginResult => {
      const p = db.profiles.find((x) => x.email.toLowerCase() === email.trim().toLowerCase());
      if (!p || password.length < 8) return { ok: false, reason: 'invalid' };
      if (p.peran !== 'pengurus') return { ok: false, reason: 'warga' };
      setUserId(p.id);
      return { ok: true };
    },
    [db.profiles]
  );

  const logout = useCallback(() => setUserId(null), []);

  const register = useCallback(
    ({ nama, email }: { nama: string; email: string }): RegisterResult => {
      if (db.profiles.some((p) => p.email.toLowerCase() === email.trim().toLowerCase())) {
        return { ok: false, field: 'email', message: 'Email ini sudah terdaftar. Silakan masuk.' };
      }
      const today = new Date();
      const created = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      setDbState((prev) => ({
        ...prev,
        profiles: [...prev.profiles, { id: newId('p'), nama: nama.trim(), email: email.trim(), peran: 'warga', created_at: created }],
      }));
      return { ok: true };
    },
    [db.profiles]
  );

  const updateUser = useCallback(
    (patch: Partial<Profile>) => {
      if (!userId) return;
      setDbState((prev) => ({ ...prev, profiles: prev.profiles.map((p) => (p.id === userId ? { ...p, ...patch } : p)) }));
    },
    [userId]
  );

  const resetData = useCallback(() => setDbState(SEED), []);

  const value = useMemo<MockContextValue>(
    () => ({ db, ready, user, setDb, login, logout, register, updateUser, resetData }),
    [db, ready, user, setDb, login, logout, register, updateUser, resetData]
  );

  return <MockContext.Provider value={value}>{children}</MockContext.Provider>;
}

export function useMock(): MockContextValue {
  const ctx = useContext(MockContext);
  if (!ctx) throw new Error('useMock harus dipakai di dalam <MockProvider>.');
  return ctx;
}
