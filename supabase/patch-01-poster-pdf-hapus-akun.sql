-- =====================================================================
-- PATCH 01 untuk database yang dibuat SEBELUM schema.sql versi ini.
-- Aman dijalankan berulang kali. Project baru cukup memakai schema.sql.
--   - kolom url_poster (kegiatan) & url_pdf (warta) yang dipakai tampilan
--   - bucket Storage "publik" untuk poster & PDF warta
--   - fungsi hapus_akun() untuk menu Akun Pengguna
--   - izin Data API (GRANT) agar aplikasi bisa membaca tabel
-- =====================================================================

alter table kegiatan add column if not exists url_poster text;
alter table warta    add column if not exists url_pdf text;

insert into storage.buckets (id, name, public)
values ('publik', 'publik', true)
on conflict (id) do nothing;

drop policy if exists "publik: pengurus kelola" on storage.objects;
create policy "publik: pengurus kelola" on storage.objects
  for all to authenticated using (bucket_id = 'publik' and is_pengurus())
  with check (bucket_id = 'publik' and is_pengurus());

create or replace function hapus_akun(target uuid) returns void
language plpgsql security definer set search_path = public, auth as $$
begin
  if not is_pengurus() then
    raise exception 'Hanya pengurus yang boleh menghapus akun';
  end if;
  if target = auth.uid() then
    raise exception 'Tidak dapat menghapus akun sendiri';
  end if;
  delete from auth.users where id = target;
end;
$$;

revoke execute on function hapus_akun(uuid) from public, anon;
grant execute on function hapus_akun(uuid) to authenticated;

-- ---------------------------------------------------------------------
-- IZIN DATA API (GRANT)
--    Project Supabase baru tidak otomatis memberi izin tabel ke aplikasi.
--    Tanpa ini login gagal walau peran sudah 'pengurus'. RLS tetap berlaku.
-- ---------------------------------------------------------------------
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant select on kegiatan, warta to anon;
grant execute on all functions in schema public to authenticated;
