# Panduan Server Actions & API – SIM GKJ Mijen

Panduan ini mengatur standar perancangan dan implementasi **Server Actions** dan **API Route Handlers** di aplikasi SIM GKJ Mijen.

---

## 1. Konvensi Server Actions

Server Actions ditempatkan pada direktori `src/features/<feature-name>/actions/index.ts`. Seluruh file Server Action harus diawali dengan direktif `'use server';`.

### Pola Implementasi Standar:
```typescript
'use server';

import { createClient } from '@/lib/supabase/server';
import { actionResponseSuccess, actionResponseError } from '@/utils';
import { jemaatSchema } from '../validations';
import type { ActionResponse } from '@/types/common.types';
import type { Jemaat, JemaatInsert } from '../types';

export async function createJemaatAction(payload: JemaatInsert): Promise<ActionResponse<Jemaat>> {
  try {
    // 1. Verifikasi Session Pengguna
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, message: 'Autentikasi diperlukan.' };
    }

    // 2. Validasi Server-Side menggunakan Zod
    const validationResult = jemaatSchema.safeParse(payload);
    if (!validationResult.success) {
      const fieldErrors: Record<string, string[]> = {};
      validationResult.error.errors.forEach((err) => {
        const field = err.path.join('.');
        fieldErrors[field] = fieldErrors[field] || [];
        fieldErrors[field].push(err.message);
      });
      return {
        success: false,
        message: 'Validasi data gagal.',
        errors: fieldErrors,
      };
    }

    // 3. Eksekusi Query ke Supabase
    const { data, error } = await supabase
      .from('jemaat')
      .insert(validationResult.data)
      .select()
      .single();

    if (error) {
      return { success: false, message: error.message };
    }

    return {
      success: true,
      message: 'Data jemaat berhasil disimpan.',
      data,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem.';
    return { success: false, message: errorMsg };
  }
}
```

---

## 2. Aturan Keamanan Server Action
1. **Jangan percaya input dari client**: Selalu jalankan parser Zod di dalam Server Action.
2. **Gunakan instance `createClient()` berbasis cookie**: Ini memastikan setiap query dieksekusi dengan konteks otentikasi user dan tunduk pada Row Level Security (RLS).
3. **Audit Trail**: Setiap mutasi bernilai tinggi (penghapusan data jemaat, transaksi keuangan, pembatalan surat) wajib mencatat histori ke tabel `activity_logs`.
