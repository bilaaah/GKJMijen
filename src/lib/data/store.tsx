'use client';

import React from 'react';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { SupabaseDataProvider } from './supabase-store';
import { DemoDataProvider } from './demo-store';

/**
 * Penyedia data untuk seluruh aplikasi.
 * - Kunci Supabase sudah diisi di .env.local → data asli dari Supabase.
 * - Belum diisi → MODE DEMO dengan data contoh (src/lib/data/demo-seed.ts).
 *
 * Komponen cukup memanggil useData(); tidak perlu tahu mode mana yang aktif.
 */
export function DataProvider({ children }: { children: React.ReactNode }) {
  return isSupabaseConfigured() ? <SupabaseDataProvider>{children}</SupabaseDataProvider> : <DemoDataProvider>{children}</DemoDataProvider>;
}

export { useData, newId } from './context';
