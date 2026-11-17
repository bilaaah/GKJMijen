# Standar Penulisan Kode (Coding Standards)

Standar ini berlaku untuk seluruh tim pengembang (Frontend & Backend) pada proyek SIM GKJ Mijen.

---

## 1. Konvensi Penamaan (Naming Conventions)

| Tipe Elemen | Konvensi | Contoh |
|---|---|---|
| **Direktori / Folder** | `kebab-case` atau `lowercase` | `jadwal-kegiatan`, `surat-arsip`, `components` |
| **Komponen React** | `PascalCase` | `Button.tsx`, `JemaatTable.tsx`, `Header.tsx` |
| **File Utilitas / Hooks** | `camelCase` | `useDebounce.ts`, `formatters.ts`, `storage.ts` |
| **Server Action Functions**| `camelCase` diakhiri `Action` | `createJemaatAction()`, `publishWartaAction()` |
| **TypeScript Types / Interfaces** | `PascalCase` | `UserRole`, `ActionResponse`, `JemaatFilterParams` |
| **Konstanta Global** | `UPPER_SNAKE_CASE` | `USER_ROLES`, `STORAGE_BUCKETS` |
| **Kolom Database & Tabel** | `snake_case` | `nomor_induk`, `transaksi_keuangan`, `wilayah_id` |
| **Environment Variables** | `UPPER_SNAKE_CASE` | `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` |

---

## 2. Aturan TypeScript
- Hindari penggunaan tipe `any`. Gunakan `unknown` jika tipe belum pasti, lalu persempit tipe (type narrowing).
- Semua Server Action harus memiliki tipe eksplisit nilai kembali: `Promise<ActionResponse<T>>`.
- Gunakan import path alias `@/*` yang merujuk pada `./src/*`.
- Jangan menggunakan relative import panjang seperti `../../../../components`.

---

## 3. Urutan Import (Import Ordering)
Susun import dengan urutan standar berikut:
1. React dan library eksternal inti (`react`, `next`, `@supabase/ssr`).
2. Tipe TypeScript (`type { ... }`).
3. Internal libraries dan helper (`@/lib/*`, `@/utils/*`, `@/hooks/*`).
4. Komponen UI bersama (`@/components/*`).
5. Feature-specific files (`../types`, `../services`).
6. Style CSS/SCSS jika ada.
